using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteRequestController : ControllerBase
    {
        private readonly IRepository _repository;

        public QuoteRequestController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetAllQuoteRequests")]
        public async Task<IActionResult> GetAllQuoteRequests()
        {
            try
            {
                var requests = await _repository.GetAllQuoteRequestsAsync();

                List<QuoteRequestViewModel> qrViewModels = new List<QuoteRequestViewModel>(); //create array of VMs
                foreach (var request in requests)
                {
                    //DON'T NEED REQUEST LINES WHEN GETTING ALL REQUESTS
                    //get all request lines associated with this request and create array from them
                    //List<QuoteRequestLineViewModel> qrLineList = new List<QuoteRequestLineViewModel>();
                    //var requestLines = await _repository.GetQuoteRequestLinesByQuoteRequestAsync(request.QuoteRequestID);

                    ////put all quote request lines for this specific quote request in a list for the quote request VM
                    //foreach (var qrLine in requestLines)
                    //{
                    //    QuoteRequestLineViewModel qrlVM = new QuoteRequestLineViewModel
                    //    {
                    //        QuoteRequestLineID = qrLine.QuoteRequestLineID,
                    //        FixedProductID = qrLine.FixedProductID == null ? 0 : qrLine.FixedProductID.Value,
                    //        CustomProductID = qrLine.CustomProductID == null ? 0 : qrLine.CustomProductID.Value,
                    //        Quantity = qrLine.Quantity
                    //    };
                    //    qrLineList.Add(qrlVM);
                    //}

                    var user = await _repository.GetUserAsync(request.UserId);
                    string fullName = user.user_FirstName + ' ' + user.user_LastName;

                    QuoteRequestViewModel qrVM = new QuoteRequestViewModel
                    {
                        QuoteRequestID = request.QuoteRequestID,
                        UserId = request.UserId,
                        UserFullName = fullName,
                        Date = request.Date,
                        //RequestLines = qrLineList
                    };
                    qrViewModels.Add(qrVM);
                }

                return Ok(qrViewModels);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }

        }

        [HttpGet]
        [Route("GetQuoteRequest/{quoteRequestId}")]
        public async Task<IActionResult> GetQuoteRequest(int quoteRequestId)
        {
            try
            {
                var quoteRequest = await _repository.GetQuoteRequestAsync(quoteRequestId);
                if (quoteRequest == null) return NotFound("The quote request does not exist on the B.O.X System");

                var requestLines = await _repository.GetQuoteRequestLinesByQuoteRequestAsync(quoteRequestId); //get all lines associated with this request
                if (requestLines == null) return NotFound("The quote request does not exist on the B.O.X System"); //an request must have at least 1 line

                //create list from request lines
                List<QuoteRequestLineViewModel> qrLineList = new List<QuoteRequestLineViewModel>();

                //put all lines for this specific request in the list
                foreach (var qrl in requestLines)
                {
                    Fixed_Product fixedProduct = new Fixed_Product();
                    Custom_Product customProduct = new Custom_Product();

                    if (qrl.FixedProductID != null) //this line holds a fixed product
                    {
                        int fpID = qrl.FixedProductID == null ? 0 : qrl.FixedProductID.Value;
                        fixedProduct = await _repository.GetFixedProductAsync(fpID);
                    }
                    else //this orderline holds a custom product
                    {
                        int cpID = qrl.CustomProductID == null ? 0 : qrl.CustomProductID.Value;
                        customProduct = await _repository.GetCustomProductAsync(cpID);
                    }

                    QuoteRequestLineViewModel qrlVM = new QuoteRequestLineViewModel
                    {
                        QuoteRequestLineID = qrl.QuoteRequestLineID,
                        FixedProductID = qrl.FixedProductID == null ? 0 : qrl.FixedProductID.Value,
                        CustomProductID = qrl.CustomProductID == null ? 0 : qrl.CustomProductID.Value,
                        Quantity = qrl.Quantity
                    };
                    qrLineList.Add(qrlVM);
                }

                var user = await _repository.GetUserAsync(quoteRequest.UserId);
                string fullName = user.user_FirstName + ' ' + user.user_LastName;

                QuoteRequestViewModel qrVM = new QuoteRequestViewModel
                {
                    QuoteRequestID = quoteRequest.QuoteRequestID,
                    UserId = quoteRequest.UserId,
                    UserFullName = fullName,
                    Date = quoteRequest.Date,
                    //RequestLines = qrLineList
                };

                return Ok(qrVM);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpPost]
        [Route("AddQuoteRequest")]
        public async Task<IActionResult> AddQuoteRequest([FromBody] QuoteRequestViewModel quoteRequestViewModel)
        {
            // Create a new instance of quote request from the view model
            var quoteRequest = new Quote_Request
            {
                UserId = quoteRequestViewModel.UserId,
                Date = DateTime.Now
            };

            try
            {
                _repository.Add(quoteRequest); // Save the qr in the repository
                await _repository.SaveChangesAsync(); // Save changes in the repository

                //get all qr lines from the VM and put in qr line entity
                for (int i = 0; i < quoteRequestViewModel.RequestLines.Count(); i++)
                {
                    var qrLineVM = quoteRequestViewModel.RequestLines[i];

                    Quote_Request_Line qrLineRecord = new Quote_Request_Line
                    {
                        QuoteRequestID = quoteRequest.QuoteRequestID,
                        CustomProductID = qrLineVM.CustomProductID == 0 ? null : qrLineVM.CustomProductID,
                        FixedProductID = qrLineVM.FixedProductID == 0 ? null : qrLineVM.FixedProductID,
                        Quantity = qrLineVM.Quantity
                    };

                    _repository.Add(qrLineRecord); //save qr line in DB
                }

                // Save changes in the repository
                await _repository.SaveChangesAsync();

                return Ok(quoteRequestViewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services. " + ex.Message + " has inner exception of " + ex.InnerException);
            }
        }

    }
}
