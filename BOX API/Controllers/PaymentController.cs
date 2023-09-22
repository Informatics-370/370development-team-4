using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;
        private readonly IRepository _repository;
        private readonly ILogger<PaymentController> _logger;
        // Change this line to use the live PayFast URL
        string url = "https://sandbox.payfast.co.za/eng/process";

        public PaymentController(IHttpClientFactory clientFactory, IConfiguration configuration, IRepository repository, ILogger<PaymentController> logger)
        {
            _clientFactory = clientFactory;
            _configuration = configuration;
            _repository = repository;
            _logger = logger;
        }

        [HttpPost("CreatePaymentRequest", Name = "CreatePaymentRequest")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreatePaymentRequest([FromBody] PayFastRequestViewModel payment)
        {
            var client = _clientFactory.CreateClient();

            //get merchant ID, key and passphrase
            if (int.TryParse(_configuration["PayFast:MerchantId"], out int merchantId))
            {
                payment.merchant_id = merchantId;
            }
            else
            {
                // Log an error
                _logger.LogError($"MerchantId value '{_configuration["PayFast:MerchantId"]}' is not a valid integer.");
            }

            payment.merchant_key = _configuration["PayFast:MerchantKey"];
            var passphrase = _configuration["PayFast:Passphrase"];
            var propertyValues = payment.GetType().GetProperties()
                .Where(p => p.GetValue(payment) != null && p.Name != "signature")
                .OrderBy(p => p.Name)
                .Select(p => $"{p.Name}={UrlEncode(p.GetValue(payment).ToString())}");

            // Now the return_url and notify_url are included in the raw data for the MD5 hash:
            var rawData = string.Join("&", propertyValues) + $"&passphrase={passphrase}";
            using (var md5 = MD5.Create())
            {
                var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                payment.signature = BitConverter.ToString(hash).Replace("-", "").ToLower();
            }

            var keyValues = payment.GetType().GetProperties()
            .Select(p => new KeyValuePair<string, string>(p.Name, p.GetValue(payment)?.ToString() ?? ""));
            var formContent = new FormUrlEncodedContent(keyValues);
            var response = await client.PostAsync(url, formContent).ConfigureAwait(false);
            var responseContent = await response.Content.ReadAsStringAsync();

            var payFastResponse = new Object();
            try
            {
                payFastResponse = JsonConvert.DeserializeObject(responseContent);
            }
            catch (JsonReaderException)
            {
                // The response content isn't valid JSON
                // Log the error and/or handle it appropriately
            }
            if (response.IsSuccessStatusCode)
            {
                // Instead of trying to read and process the response content, just return the URL.
                //return Ok(url);
                return Ok(payment);
            }
            else
            {
                // Handle the error...
                return BadRequest(responseContent);
            }
        }

        private string UrlEncode(string value)
        {
            return WebUtility.UrlEncode(value)?.Replace("%20", "+");
        }

        [HttpPost("HandlePaymentResult/{paymentTypeId}")]
        public async Task<IActionResult> HandlePaymentResult(int paymentTypeId , [FromBody] PayFastRequestViewModel payment)
        {
            if (payment == null)
            {
                return BadRequest();
            }

            // Get your passphrase from configuration
            var passphrase = _configuration["PayFast:Passphrase"];

            // Generate a signature from the incoming payment data
            var propertyValues = payment.GetType().GetProperties()
                .Where(p => p.GetValue(payment) != null && p.Name != "signature")
                .OrderBy(p => p.Name)
                .Select(p => $"{p.Name}={UrlEncode(p.GetValue(payment).ToString())}");
            var rawData = string.Join("&", propertyValues) + $"&passphrase={passphrase}";
            
            using (var md5 = MD5.Create())
            {
                var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                var generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

                // Compare the generated signature with the one in the request
                if (payment.signature != generatedSignature)
                {
                    _logger.LogError("Payment signature verification failed."); // Log an error, the signatures do not match
                    return BadRequest("Payment signature verification failed.");
                }
            }

            // If the signatures match, continue with saving the payment to the database
            Payment newPayment = new Payment
            {
                PaymentTypeID = paymentTypeId,
                Date_And_Time = DateTime.Now,
                Amount = payment.amount,
                Signature = payment.signature
            };

            _repository.Add(newPayment); //add payment
            await _repository.SaveChangesAsync(); //save

            // After saving the payment to the database, return a successful response
            return Ok();
        }
    }
}
