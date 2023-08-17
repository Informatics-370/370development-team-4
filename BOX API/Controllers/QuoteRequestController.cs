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

        //gets all quote requests that have not been turned into quotes i.e. where the status is 'Requested'
        [HttpGet]
        [Route("GetAllActiveQuoteRequests")]
        public async Task<IActionResult> GetAllActiveQuoteRequests()
        {
            try
            {
                var requests = await _repository.GetAllActiveQuoteRequests();

                List<QuoteViewModel> qrViewModels = new List<QuoteViewModel>(); //create array of VMs
                foreach (var request in requests)
                {
                    //DON'T NEED REQUEST LINES WHEN GETTING ALL ACTIVE REQUESTS
                    /*//get all request lines associated with this request and create array from them
                    List<QuoteLineViewModel> qrLineList = new List<QuoteLineViewModel>();
                    var requestLines = await _repository.GetQuoteRequestLinesByQuoteRequestAsync(request.QuoteRequestID);

                    //put all quote request lines for this specific quote request in a list for the quote request VM
                    foreach (var qrLine in requestLines)
                    {
                        QuoteLineViewModel qrlVM = new QuoteLineViewModel
                        {
                            QuoteRequestLineID = qrLine.QuoteRequestLineID,
                            FixedProductID = qrLine.FixedProductID == null ? 0 : qrLine.FixedProductID.Value,
                            CustomProductID = qrLine.CustomProductID == null ? 0 : qrLine.CustomProductID.Value,
                            Quantity = qrLine.Quantity
                        };
                        qrLineList.Add(qrlVM);
                    }*/

                    string fullName = await _repository.GetUserFullNameAsync(request.UserId);

                    QuoteViewModel qrVM = new QuoteViewModel
                    {
                        QuoteRequestID = request.QuoteRequestID,
                        CustomerId = request.UserId,
                        CustomerFullName = fullName,
                        DateRequested = request.Date,
                        //Lines = qrLineList
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
                List<QuoteLineViewModel> qrLineList = new List<QuoteLineViewModel>();

                //put all lines for this specific request in the list
                foreach (var qrl in requestLines)
                {
                    Fixed_Product fixedProduct = new Fixed_Product();
                    Custom_Product customProduct = new Custom_Product();
                    string customProdDescription = "Custom product ";
                    decimal price = 0;

                    if (qrl.FixedProductID != null) //this line holds a fixed product
                    {
                        int fpID = qrl.FixedProductID.Value;
                        fixedProduct = await _repository.GetFixedProductAsync(fpID);
                        //get price
                        Price priceRecord = await _repository.GetPriceByFixedProductAsync(fpID);
                        price = priceRecord.Amount;
                    }
                    else //this line holds a custom product
                    {
                        int cpID = qrl.CustomProductID.Value;
                        customProduct = await _repository.GetCustomProductAsync(cpID);
                        //get price
                        Cost_Price_Formula_Variables cpfv = await _repository.GetFormulaVariablesAsync(customProduct.FormulaID);
                        if (customProduct.FormulaID == 1) //single wall box
                        {
                            price = (2 * (customProduct.Length + customProduct.Width) + 40 * (customProduct.Width + customProduct.Height) + 10 * cpfv.Box_Factor * cpfv.Rate_Per_Ton) / 1000;
                        }
                        else //double wall
                        {
                            price = (2 * (customProduct.Length + customProduct.Width) + 50 * (customProduct.Width + customProduct.Height) + 14 * cpfv.Box_Factor * cpfv.Rate_Per_Ton) / 1000;
                        }

                        //add factory cost and markup
                        price += price * cpfv.Factory_Cost / 100;
                        price += price * cpfv.Mark_Up / 100;

                        //concatenate custom product string
                        customProdDescription += customProduct.Length + "mm x " + customProduct.Width + "mm x " + customProduct.Height + "mm";
                    }

                    QuoteLineViewModel qrlVM = new QuoteLineViewModel
                    {
                        QuoteRequestLineID = qrl.QuoteRequestLineID,
                        FixedProductID = qrl.FixedProductID == null ? 0 : qrl.FixedProductID.Value,
                        FixedProductDescription = fixedProduct.Description,
                        CustomProductID = qrl.CustomProductID == null ? 0 : qrl.CustomProductID.Value,
                        CustomProductDescription = customProdDescription,
                        SuggestedUnitPrice = price,                        
                        Quantity = qrl.Quantity
                    };
                    qrLineList.Add(qrlVM);
                }

                string fullName = await _repository.GetUserFullNameAsync(quoteRequest.UserId);

                QuoteViewModel qrVM = new QuoteViewModel
                {
                    QuoteRequestID = quoteRequest.QuoteRequestID,
                    CustomerId = quoteRequest.UserId,
                    CustomerFullName = fullName,
                    DateRequested = quoteRequest.Date,
                    Lines = qrLineList
                };

                return Ok(qrVM);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpGet]
        [Route("CheckForActiveQuoteRequest/{customerId}")]
        public async Task<IActionResult> CheckForActiveQuoteRequest(string customerId)
        {
            try
            {
                var activeQR = await _repository.CheckForActiveQuoteRequestAsync(customerId);

                bool hasActiveQR = activeQR != null; //true if customer has active QR; false otherwise

                return Ok(hasActiveQR);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpPost]
        [Route("AddQuoteRequest")]
        public async Task<IActionResult> AddQuoteRequest([FromBody] QuoteViewModel quoteRequestViewModel)
        {
            // Start a database transaction; because of this, nothing is fully saved until the end i.e. unless request and request lines are created successfully with no errors, the request isn't created
            //this prevents having a request with no request lines which was an issue when I was testing
            var transaction = _repository.BeginTransaction();

            // Create a new instance of quote request from the view model
            var quoteRequest = new Quote_Request
            {
                UserId = quoteRequestViewModel.CustomerId,
                Date = DateTime.Now,
                QuoteRequestStatusID = 1 //status 1 = Requested
            };

            try
            {
                _repository.Add(quoteRequest); // Save the qr in the repository
                await _repository.SaveChangesAsync(); // Save changes in the repository

                //get all qr lines from the VM and put in qr line entity
                for (int i = 0; i < quoteRequestViewModel.Lines.Count(); i++)
                {
                    var qrLineVM = quoteRequestViewModel.Lines[i];

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
                transaction.Commit(); //commit transaction

                return Ok(quoteRequestViewModel);
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services. " + ex.Message + " has inner exception of " + ex.InnerException);
            }
        }

    }
}
