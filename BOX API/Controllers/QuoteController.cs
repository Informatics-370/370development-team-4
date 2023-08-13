using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;


namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuoteController : ControllerBase
    {
        private readonly IRepository _repository;

        public QuoteController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetAllQuotes")]
        public async Task<IActionResult> GetAllQuotes()
        {
            try
            {
                var quotes = await _repository.GetAllQuotesAsync();

                List<QuoteViewModel> qouteViewModels = new List<QuoteViewModel>(); //create array of VMs
                foreach (var quote in quotes)
                {
                    //get all quote lines associated with this quote and create array from them
                    List<QuoteLineViewModel> qlList = new List<QuoteLineViewModel>();
                    var quoteLines = await _repository.GetQuoteLinesByQuoteAsync(quote.QuoteID);

                    //put all quote lines for this specific quote in a list for the quote VM
                    foreach (var ql in quoteLines)
                    {
                        QuoteLineViewModel qlVM = new QuoteLineViewModel
                        {
                            QuoteLineID = ql.QuoteLineID,
                            FixedProductID = ql.FixedProductID == null ? 0 : ql.FixedProductID.Value,
                            CustomProductID = ql.CustomProductID == null ? 0 : ql.CustomProductID.Value,
                            ConfirmedUnitPrice = ql.Confirmed_Unit_Price,
                            Quantity = ql.Quantity
                        };
                        qlList.Add(qlVM);
                    }

                    string fullName = await _repository.GetUserFullNameAsync(quote.UserId);
                    var status = await _repository.GetQuoteStatusAsync(quote.QuoteStatusID);

                    QuoteViewModel qrVM = new QuoteViewModel
                    {
                        QuoteID = quote.QuoteID,
                        QuoteRequestID = quote.QuoteRequestID,
                        QuoteStatusID = quote.QuoteStatusID,
                        QuoteStatusDescription = status.Description,
                        CustomerId = quote.UserId,
                        CustomerFullName = fullName,
                        QuoteDurationID = quote.QuoteDurationID,
                        DateGenerated = quote.Date_Generated,
                        RejectReasonID = quote.RejectReasonID == null ? 0 : quote.RejectReasonID.Value,
                        Lines = qlList
                    };
                    qouteViewModels.Add(qrVM);
                }

                return Ok(qouteViewModels);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }

        }

        //-------------------------------------------------- Get QUOTE By ID ------------------------------------------------
        [HttpGet]
        [Route("GetQuote/{quoteId}")]
        public async Task<IActionResult> GetQuote(int quoteId)
        {
            try
            {
                var quote = await _repository.GetQuoteAsync(quoteId);
                if (quote == null) return NotFound("The quote does not exist on the B.O.X System");

                var quoteLines = await _repository.GetQuoteLinesByQuoteAsync(quote.QuoteID); //get all quote lines associated with this quote
                if (quoteLines == null) return NotFound("The quote does not exist on the B.O.X System"); //an quote must have at least 1 line

                List<QuoteLineViewModel> qlList = new List<QuoteLineViewModel>(); //create array

                //put all quote lines for this specific quote in a list for the quote VM
                foreach (var ql in quoteLines)
                {
                    Fixed_Product fixedProduct = new Fixed_Product();
                    string customProdDescription = "Custom product ";

                    if (ql.CustomProductID != null) //this line holds a custom product
                    {
                        int cpID = ql.CustomProductID.Value;
                        Custom_Product customProduct = await _repository.GetCustomProductAsync(cpID);

                        //concatenate custom product string
                        customProdDescription += customProduct.Length + "mm x " + customProduct.Width + "mm x " + customProduct.Height + "mm";
                    }
                    else //this line holds a fixed product
                    {
                        int fpID = ql.FixedProductID.Value;
                        fixedProduct = await _repository.GetFixedProductAsync(fpID);
                    }

                    QuoteLineViewModel qlVM = new QuoteLineViewModel
                    {
                        QuoteLineID = ql.QuoteLineID,
                        FixedProductID = ql.FixedProductID == null ? 0 : ql.FixedProductID.Value,
                        FixedProductDescription = fixedProduct.Description,
                        CustomProductID = ql.CustomProductID == null ? 0 : ql.CustomProductID.Value,
                        CustomProductDescription = customProdDescription,
                        ConfirmedUnitPrice = ql.Confirmed_Unit_Price,
                        Quantity = ql.Quantity
                    };
                    qlList.Add(qlVM);
                }

                string fullName = await _repository.GetUserFullNameAsync(quote.UserId);
                var status = await _repository.GetQuoteStatusAsync(quote.QuoteStatusID);
                var rejectReason = new Reject_Reason();

                if (quote.RejectReasonID != null)
                {
                    int rejectReasonID = quote.RejectReasonID.Value;
                    rejectReason = await _repository.GetRejectReasonAsync(rejectReasonID);
                }
                string priceMatchFileB64 = rejectReason.Price_Match_File != null ? Convert.ToBase64String(rejectReason.Price_Match_File.File) : "";

                QuoteViewModel qrVM = new QuoteViewModel
                {
                    QuoteID = quote.QuoteID,
                    QuoteRequestID = quote.QuoteRequestID,
                    QuoteStatusID = quote.QuoteStatusID,
                    QuoteStatusDescription = status.Description,
                    CustomerId = quote.UserId,
                    CustomerFullName = fullName,
                    QuoteDurationID = quote.QuoteDurationID,
                    DateGenerated = quote.Date_Generated,
                    RejectReasonID = rejectReason.RejectReasonID,
                    RejectReasonDescription = rejectReason.Description,
                    PriceMatchFileB64 = priceMatchFileB64,
                    Lines = qlList
                };

                return Ok(qrVM); //return quote VM which contains quote info plus quote lines info in list format
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services." + ex.Message + ex.InnerException);
            }
        }

        [HttpGet]
        [Route("GetQuoteByCustomer/{customerId}")]
        public async Task<IActionResult> GetQuoteByCustomer(string customerId)
        {
            try
            {
                List<QuoteViewModel> customerQuoteVMs = new List<QuoteViewModel>(); //create list to return
                var quotes = await _repository.GetQuotesByCustomerAsync(customerId); //get all quotes for this customer

                foreach (var quote in quotes)
                {
                    //get all quote lines associated with this quote and create array from them
                    List<QuoteLineViewModel> qlList = new List<QuoteLineViewModel>();

                    var quoteLines = await _repository.GetQuoteLinesByQuoteAsync(quote.QuoteID);
                    if (quoteLines == null) return NotFound("The quote does not exist on the B.O.X System"); //an quote must have at least 1 line

                    //put all quote lines for this specific quote in a list for the quote VM
                    foreach (var ql in quoteLines)
                    {
                        int fpID = ql.FixedProductID == null ? 0 : ql.FixedProductID.Value;
                        Fixed_Product fixedProduct = await _repository.GetFixedProductAsync(fpID);
                        string customProdDescription = "Custom product ";

                        if (ql.CustomProductID != null) //this quote line holds a custom product
                        {
                            int cpID = ql.CustomProductID.Value;
                            Custom_Product customProduct = await _repository.GetCustomProductAsync(cpID);

                            //concatenate custom product string
                            customProdDescription += customProduct.Length + "mm x " + customProduct.Width + "mm x " + customProduct.Height + "mm";
                        }

                        QuoteLineViewModel qlVM = new QuoteLineViewModel
                        {
                            QuoteLineID = ql.QuoteLineID,
                            FixedProductID = ql.FixedProductID == null ? 0 : ql.FixedProductID.Value,
                            FixedProductDescription = fixedProduct.Description,
                            CustomProductID = ql.CustomProductID == null ? 0 : ql.CustomProductID.Value,
                            CustomProductDescription = customProdDescription,
                            ConfirmedUnitPrice = ql.Confirmed_Unit_Price,
                            Quantity = ql.Quantity
                        };
                        qlList.Add(qlVM);
                    }

                    string fullName = await _repository.GetUserFullNameAsync(quote.UserId);
                    var status = await _repository.GetQuoteStatusAsync(quote.QuoteStatusID);
                    var rejectReason = new Reject_Reason();

                    if (quote.RejectReasonID != null)
                    {
                        int rejectReasonID = quote.RejectReasonID.Value;
                        rejectReason = await _repository.GetRejectReasonAsync(rejectReasonID);
                    }
                    string priceMatchFileB64 = rejectReason.Price_Match_File != null ? Convert.ToBase64String(rejectReason.Price_Match_File.File) : "";

                    QuoteViewModel qrVM = new QuoteViewModel
                    {
                        QuoteID = quote.QuoteID,
                        QuoteStatusID = quote.QuoteStatusID,
                        QuoteStatusDescription = status.Description,
                        CustomerId = quote.UserId,
                        CustomerFullName = fullName,
                        QuoteDurationID = quote.QuoteDurationID,
                        DateGenerated = quote.Date_Generated,
                        RejectReasonID = rejectReason.RejectReasonID,
                        RejectReasonDescription = rejectReason.Description,
                        PriceMatchFileB64 = priceMatchFileB64,
                        Lines = qlList
                    };
                    customerQuoteVMs.Add(qrVM);
                }

                return Ok(customerQuoteVMs);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpGet]
        [Route("GetCustomerMostRecentQuote/{customerId}")]
        public async Task<IActionResult> GetCustomerMostRecentQuote(string customerId)
        {
            try
            {
                var mostRecentQuote = _repository.GetCustomerMostRecentQuote(customerId); //get this customer's most recent quote
                if (mostRecentQuote == null) return NotFound("The quote does not exist on the B.O.X System");

                //get all quote lines associated with this quote and create array from them
                List<QuoteLineViewModel> qlList = new List<QuoteLineViewModel>();

                var quoteLines = await _repository.GetQuoteLinesByQuoteAsync(mostRecentQuote.QuoteID);
                if (quoteLines == null) return NotFound("The quote does not exist on the B.O.X System"); //a quote must have at least 1 line

                //put all quote lines for this quote in a list for the quote VM
                foreach (var ql in quoteLines)
                {
                    int fpID = ql.FixedProductID == null ? 0 : ql.FixedProductID.Value;
                    Fixed_Product fixedProduct = await _repository.GetFixedProductAsync(fpID);
                    string customProdDescription = "Custom product ";

                    if (ql.CustomProductID != null) //this quote line holds a custom product
                    {
                        int cpID = ql.CustomProductID.Value;
                        Custom_Product customProduct = await _repository.GetCustomProductAsync(cpID);

                        //concatenate custom product string
                        customProdDescription += customProduct.Length + "mm x " + customProduct.Width + "mm x " + customProduct.Height + "mm";
                    }

                    QuoteLineViewModel qlVM = new QuoteLineViewModel
                    {
                        QuoteLineID = ql.QuoteLineID,
                        FixedProductID = ql.FixedProductID == null ? 0 : ql.FixedProductID.Value,
                        FixedProductDescription = fixedProduct.Description,
                        CustomProductID = ql.CustomProductID == null ? 0 : ql.CustomProductID.Value,
                        CustomProductDescription = customProdDescription,
                        ConfirmedUnitPrice = ql.Confirmed_Unit_Price,
                        Quantity = ql.Quantity
                    };
                    qlList.Add(qlVM);
                }

                string fullName = await _repository.GetUserFullNameAsync(mostRecentQuote.UserId);
                var status = await _repository.GetQuoteStatusAsync(mostRecentQuote.QuoteStatusID);

                QuoteViewModel qrVM = new QuoteViewModel
                {
                    QuoteID = mostRecentQuote.QuoteID,
                    QuoteStatusID = mostRecentQuote.QuoteStatusID,
                    QuoteStatusDescription = status.Description,
                    CustomerId = mostRecentQuote.UserId,
                    CustomerFullName = fullName,
                    QuoteDurationID = mostRecentQuote.QuoteDurationID,
                    DateGenerated = mostRecentQuote.Date_Generated,
                    RejectReasonID = mostRecentQuote.RejectReasonID == null ? 0 : mostRecentQuote.RejectReasonID.Value,
                    Lines = qlList
                };

                return Ok(mostRecentQuote);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //-------------------------------------------------- Create Quote  ----------------------------------------------------
        [HttpPost]
        [Route("AddQuote")]
        public async Task<IActionResult> AddQuote([FromBody] QuoteViewModel quoteViewModel)
        {
            // Start a database transaction; because of this, nothing is fully saved until the end i.e. unless quote and quote lines are created successfully with no errors, the quote isn't created
            //this prevents having a quote with no lines which was an issue when I was testing
            var transaction = _repository.BeginTransaction();

            // Create a new instance of Quote from the view model
            var quote = new Quote
            {
                //hard coded values are constant or can only ever be 1 in the DB. It'll be fine as long as we remember to change it on each person's machine and 1ce and for all on the final server
                QuoteRequestID = quoteViewModel.QuoteRequestID,
                QuoteStatusID = 1, //quote status of 'Pending review'. Statuses can't be CRUDed so this can be hard coded
                QuoteDurationID = 1,
                UserId = quoteViewModel.CustomerId,
                Date_Generated = DateTime.Now
            }; //do not add value for quoteID manually else SQL won't auto generate it

            try
            {
                _repository.Add(quote); // Save the quote in the repository
                await _repository.SaveChangesAsync(); //save changes so quote ID is generated

                //get all quote lines from the VM and put in quote_line entity
                for (int i = 0; i < quoteViewModel.Lines.Count(); i++)
                {
                    var quoteLineVM = quoteViewModel.Lines[i];

                    Quote_Line quoteLineRecord = new Quote_Line
                    {
                        QuoteID = quote.QuoteID, //it's NB to save the quote 1st so SQL generates its ID to use in the quote line concatenated ID
                        Quote = quote,
                        FixedProductID = quoteLineVM.FixedProductID == 0 ? null : quoteLineVM.FixedProductID,
                        CustomProductID = quoteLineVM.CustomProductID == 0 ? null : quoteLineVM.CustomProductID,
                        Confirmed_Unit_Price = quoteLineVM.ConfirmedUnitPrice,
                        Quantity = quoteLineVM.Quantity
                    };

                    _repository.Add(quoteLineRecord); //save quote line in DB
                }

                // Save changes in the repository
                await _repository.SaveChangesAsync();
                transaction.Commit(); //commit transaction i.e. save fully

                return Ok(quoteViewModel);
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services. " + ex.Message + " has inner exception of " + ex.InnerException);
            }
        }

        [HttpDelete]
        [Route("DeleteQuote/{quoteId}")]
        public async Task<IActionResult> DeleteQuote(int quoteId)
        {
            try
            {
                var existingQuote = await _repository.GetQuoteAsync(quoteId); //get quote
                if (existingQuote == null) return NotFound($"The quote does not exist on the B.O.X System");

                var existingQuoteLines = await _repository.GetQuoteLinesByQuoteAsync(quoteId); //get this quote's lines
                if (existingQuoteLines == null) return NotFound($"The quote does not exist on the B.O.X System");

                //delete quotes lines
                foreach (var line in existingQuoteLines)
                {
                    _repository.Delete(line);
                }

                _repository.Delete(existingQuote); //delete quote

                if (await _repository.SaveChangesAsync()) return Ok(existingQuote);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpPut]
        [Route("UpdateQuoteStatus/{quoteId}/{statusId}")]
        public async Task<IActionResult> UpdateQuoteStatus(int quoteId, int statusId)
        {
            try
            {

                var existingQuote = await _repository.GetQuoteAsync(quoteId); //get quote
                var existingStatus = await _repository.GetQuoteStatusAsync(statusId); //make sure the status exists

                if (existingQuote == null) return NotFound($"The quote does not exist on the B.O.X System");
                if (existingStatus == null) return NotFound($"The quote status does not exist on the B.O.X System");

                existingQuote.QuoteStatusID = statusId; //update status

                // Update the Quote in the repository
                await _repository.UpdateQuoteAsync(existingQuote);

                return Ok(existingQuote);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }
    }
}
