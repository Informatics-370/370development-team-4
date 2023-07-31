using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;


namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstimateController : ControllerBase
    {
        private readonly IRepository _repository;

        public EstimateController(IRepository repository)
        {
            _repository = repository;
        }

        //-------------------------------------------------- Get All Estimates --------------------------------------------------
        [HttpGet]
        [Route("GetAllEstimates")]
        public async Task<IActionResult> GetAllEstimates()
        {
            try
            {
                var estimates = await _repository.GetAllEstimatesAsync();

                List<EstimateViewModel> EstimateViewModels = new List<EstimateViewModel>(); //create array of VMs
                foreach (var estimate in estimates)
                {
                    var Status = await _repository.GetEstimateStatusAsync(estimate.EstimateStatusID); //get status associated with this estimate

                    //get all estimate lines associated with this estimate and create array from them
                    List<EstimateLineViewModel> estimateLineList = new List<EstimateLineViewModel>();
                    var estimateLines = await _repository.GetEstimateLinesByEstimateAsync(estimate.EstimateID);

                    //an estimate must have at least 1 line else it's not a real order and will cause an error
                    if (estimateLines == null) return NotFound("The estimate does not exist on the B.O.X System.");

                    //put all estimate lines for this specific estimate in a list for the estimate VM
                    foreach (var el in estimateLines)
                    {
                        int fpID = el.FixedProductID == null ? 0 : el.FixedProductID.Value;

                        EstimateLineViewModel elvm = new EstimateLineViewModel()
                        {
                            //The attributes below all pertain to the Actual EstimateLine Entity except the CustomerID. Not the View Model**
                            EstimateLineID = el.EstimateLineID,
                            EstimateID = el.EstimateID,
                            FixedProductID = fpID,
                            CustomProductID = 0,
                            Quantity = el.Quantity
                            //The customerID is intentionally left out so that we get all the Estimates for every single Customer
                        };
                        estimateLineList.Add(elvm);
                    }
                    //This is still contained in the greater for loop which is iterating for every single estimate that is the estimate VM
                    EstimateViewModel eVM = new EstimateViewModel()
                    {
                        EstimateID = estimate.EstimateID,
                        EstimateStatusID = estimate.EstimateStatusID,
                        EstimateDurationID = estimate.EstimateDurationID,
                        CustomerID = estimateLines[0].CustomerID,
                        EstimateStatusDescription = Status.Description,
                        ConfirmedTotal = estimate.Confirmed_Total_Price,
                        Estimate_Lines = estimateLineList
                        //The Customer Name attribute does not appear here
                    };
                    EstimateViewModels.Add(eVM);
                }


                return Ok(EstimateViewModels);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }

        }


        //-------------------------------------------------- Get Estimate By ID ------------------------------------------------
        [HttpGet]
        [Route("GetEstimate/{estimateId}")]
        public async Task<IActionResult> GetEstimate(int estimateId)
        {
            try
            {
                var estimate = await _repository.GetEstimateAsync(estimateId);
                if (estimate == null) return NotFound("The estimate does not exist on the B.O.X System");

                var estimateLines = await _repository.GetEstimateLinesByEstimateAsync(estimate.EstimateID); //get all estimate lines associated with this estimate
                if (estimateLines == null) return NotFound("The estimate does not exist on the B.O.X System"); //an estimate must have at least 1 line

                //create list from estimate lines
                List<EstimateLineViewModel> estimateLineList = new List<EstimateLineViewModel>();

                //put all estimate lines for this specific estimate in the list
                foreach (var el in estimateLines)
                {
                    int fpID = el.FixedProductID == null ? 0 : el.FixedProductID.Value;
                    //when I display a specific estimate, I also display the fixed product unit price and description
                    var fixedProduct = await _repository.GetFixedProductAsync(fpID);

                    EstimateLineViewModel elvm = new EstimateLineViewModel()
                    {
                        EstimateLineID = el.EstimateLineID,
                        EstimateID = el.EstimateID,
                        FixedProductID = fpID,
                        FixedProductDescription = fixedProduct.Description,
                        FixedProductUnitPrice = fixedProduct.Price,
                        CustomProductID = 0,
                        Quantity = el.Quantity
                    };
                    estimateLineList.Add(elvm);
                }

                var status = await _repository.GetEstimateStatusAsync(estimate.EstimateStatusID); //get status associated with this estimate
                var EstimateViewModel = new EstimateViewModel
                {
                    EstimateID = estimate.EstimateID,
                    EstimateStatusID = estimate.EstimateStatusID,
                    EstimateStatusDescription = status.Description,
                    EstimateDurationID = estimate.EstimateDurationID,
                    ConfirmedTotal = estimate.Confirmed_Total_Price,
                    CustomerID = estimateLines[0].CustomerID,
                    Estimate_Lines = estimateLineList
                };

                return Ok(EstimateViewModel); //return estimate VM which contains estimate info plus estimate lines info in list format
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services." + ex.Message + ex.InnerException);
            }
        }

        [HttpGet]
        [Route("GetEstimateByCustomer/{customerId}")]
        public async Task<IActionResult> GetEstimateByCustomer(int customerId)
        {
            try
            {
                List<EstimateViewModel> customerEstimates = new List<EstimateViewModel>(); //create list to return
                var estimateLines = await _repository.GetEstimateLinesByCustomerAsync(customerId); //get all estimate lines for this customer

                /*What I want to do: get all the estimates a customer has ever made in a list of estimate VMs
                But, the estimate entity doesn't contain the customerID, estimate lines does because it's the associative entity inbetween
                so I get all the estimate lines made by a customer and I want to sort them into estimates i.e. estimateVM 1 should 
                contain only its estimate lines. To do that, I first find out how many estimates there are, using the distinct() 
                method and create estimateVMs for them. Then I loop through each estimate line and sort them into their estimates.
                Hopefully this make sense to future Charis */

                List<EstimateLineViewModel> allCustomerEstimateLines = new List<EstimateLineViewModel>();

                //put all the customer's estimate lines in VM
                foreach (var el in estimateLines)
                {
                    int fpID = el.FixedProductID == null ? 0 : el.FixedProductID.Value;
                    var fixedProduct = await _repository.GetFixedProductAsync(fpID);

                    EstimateLineViewModel elVM = new EstimateLineViewModel
                    {
                        EstimateLineID = el.EstimateLineID,
                        EstimateID = el.EstimateID,
                        FixedProductID = fpID,
                        FixedProductDescription = fixedProduct.Description,
                        FixedProductUnitPrice = fixedProduct.Price,
                        Quantity = el.Quantity
                    };
                    allCustomerEstimateLines.Add(elVM);
                }

                //Create estimate VMs for all the customer's estimates then group estimate lines into the estimate VMs
                var distinctEstimateLines = estimateLines.Select(el => el.EstimateID).Distinct(); //returns all distinct estimate IDs
                int estimateCount = distinctEstimateLines.Count(); //count how many estimates there are

                foreach (var estimateID in distinctEstimateLines) //get all the estimates using the distinct estimateIDs and estimateVM
                {
                    Estimate estimate = await _repository.GetEstimateAsync(estimateID);
                    var status = await _repository.GetEstimateStatusAsync(estimate.EstimateStatusID); //get status data

                    EstimateViewModel eVM = new EstimateViewModel
                    {
                        EstimateID = estimate.EstimateID,
                        EstimateStatusID = estimate.EstimateStatusID,
                        EstimateStatusDescription = status.Description,
                        EstimateDurationID = estimate.EstimateDurationID,
                        ConfirmedTotal = estimate.Confirmed_Total_Price,
                        CustomerID = customerId,
                        Estimate_Lines = allCustomerEstimateLines.Where(el => el.EstimateID == estimateID).ToList() //get all estimate lines for this estimate
                    };

                    customerEstimates.Add(eVM);
                }

                return Ok(customerEstimates);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //-------------------------------------------------- Create Estimate  ----------------------------------------------------
        [HttpPost]
        [Route("AddEstimate")]
        public async Task<IActionResult> AddEstimate([FromBody] EstimateViewModel estimateViewModel)
        {
            // Create a new instance of Estimate from the view model
            var estimate = new Estimate
            {
                //hard coded values are constant or can only ever be 1 in the DB. It'll be fine as long as we remember to change it on each person's machine and 1ce and for all on the final server
                EstimateStatusID = 1, //estimate status of 'Pending review'. Statuses can't be CRUDed so this can be hard coded
                EstimateDurationID = 1, //estimate duration of 20 days.
                Confirmed_Total_Price = estimateViewModel.ConfirmedTotal
            }; //do not add value for estimateID manually else SQL won't auto generate it

            try
            {
                _repository.Add(estimate); // Save the estimate in the repository

                //get all estimate lines from the VM and put in estimate_line entity
                for (int i = 0; i < estimateViewModel.Estimate_Lines.Count(); i++)
                {
                    var estimateLineVM = estimateViewModel.Estimate_Lines[i];

                    /*the estimate_line entity's ID is concatenated using customer ID, estimate ID and estimate line ID. An 
                    estimate with ID 5 by customer with ID 16, and 2 estimate lines will have 7 estimate_line records with IDs like so:
                        estimate ID: 5, customer ID: 16, and estimate line ID: 1
                        estimate ID: 5, customer ID: 16, and estimate line ID: 2
                    a new estimate by customer 16 with 3 estimate lines will be
                        estimate ID: 6, customer ID: 16, and estimate line ID: 1
                        estimate ID: 6, customer ID: 16, and estimate line ID: 2
                        estimate ID: 6, customer ID: 16, and estimate line ID: 3 */
                    Estimate_Line estimateLineRecord = new Estimate_Line
                    {
                        EstimateLineID = i + 1, //e.g. 1, then 2, 3, etc.
                        CustomerID = estimateViewModel.CustomerID,
                        EstimateID = estimate.EstimateID, //it's NB to save the estimate 1st so SQL generates its ID to use in the estimate line concatenated ID
                        Estimate = estimate,
                        FixedProductID = estimateLineVM.FixedProductID,
                        Quantity = estimateLineVM.Quantity
                    };

                    _repository.Add(estimateLineRecord); //save estimate line in DB
                }

                // Save changes in the repository
                await _repository.SaveChangesAsync();

                return Ok(estimateViewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services. " + ex.Message + " has inner exception of " + ex.InnerException);
            }
        }

        //--------------------------------------------------UPDATE ESTIMATE--------------------------------------------
        [HttpPut]
        [Route("UpdateEstimate/{estimateId}")]
        public async Task<IActionResult> UpdateEstimate(int estimateId, [FromBody] EstimateViewModel updatedEstimateVM)
        {
            try
            {
                var existingEstimate = await _repository.GetEstimateAsync(estimateId); //Retrieve the existing estimate from the database
                if (existingEstimate == null) return NotFound($"The estimate does not exist on the B.O.X System");

                var existingEstimateLines = await _repository.GetEstimateLinesByEstimateAsync(estimateId); //get this estimate's lines
                if (existingEstimateLines == null) return NotFound($"The estimate does not exist on the B.O.X System"); //every estimate must have at least 1 line

                //Update the estimate
                existingEstimate.EstimateStatusID = 2; //status ID of 'Reviewed'.
                existingEstimate.Confirmed_Total_Price = updatedEstimateVM.ConfirmedTotal;

                //await _repository.UpdateEstimateAsync(existingEstimate); // Update the Estimate in the repository

                /*The next bit of code is a lil complicated but it was fun to write. Lengthy comments can explain to future me and anyone interested
                update estimate lines only if there are updates to apply; shouldn't they be able to update estimate quantity? If they can, the code below must change
                can only add new lines and can't change previous lines so the code below ignores previous lines 
                (because they are untouched) and only creates new lines */

                /*EXAMPLE: customer added 3 things to cart and clicked 'Get in touch with us'. After negotiations, price changed 
                and they now want 5 things, i.e. 2 new products were added to their estimate.
                Therefore original estimateLinesCount = 3 (original length) and updated estimate VM line count = 5 */
                int estimateLinesCount = existingEstimateLines.Length; //e.g. 3

                //e.g. if (5 != 3); if no new products were added it will be if (3 != 3), which is false so estimate lines won't be updated
                if (updatedEstimateVM.Estimate_Lines.Count() != estimateLinesCount)
                {
                    int newEstimateLinesCount = updatedEstimateVM.Estimate_Lines.Count() - estimateLinesCount; //5 - 3 = 2

                    //create new estimate lines to represent the products added to the estimate to put in the DB
                    for (int i = 0; i < newEstimateLinesCount; i++) //e.g. loop 2 times when i = 0 and 1 to create 2 new estimate lines
                    {
                        /*updatedEstimateVM's estimate lines has all the estimate lines, e.g. the 3 original products in the cart 
                        plus the 2 the customer asked to be added during negotiations. They will look like this: 
                            [orignalEstimateLine1, originalEstimateLine2, originalEstimateLine3, newEstimateLine1, newEstimateLine2 ]
                        The original 3 are unchanged so I don't want them. I'll start with the 1st new line that has index of 3
                        This index can be calculated as: estimateLinesCount + i = 3 + 0 = 3
                        On the 2nd loop iteration, I want the 2nd new estimate line and the index of 4 will be calculated the same way:
                            estimateLinesCount + i = 3 + 1 = 4
                         */
                        int index = estimateLinesCount + i; //calculate index
                        var line = updatedEstimateVM.Estimate_Lines[index];

                        /*To understand how estimate_line entity IDs work, look at line 148 on this page.
                         e.g. because the last estimateLineID used was 3, I need to start from 4 which can be calculated by index + 1
                        On the next loop iteration, estimateLineID should be 5 which will still be = index + 1 */
                        Estimate_Line estimateLineRecord = new Estimate_Line
                        {
                            EstimateLineID = index + 1,
                            CustomerID = updatedEstimateVM.CustomerID,
                            EstimateID = estimateId,
                            FixedProductID = line.FixedProductID,
                            Quantity = line.Quantity
                        };

                        _repository.Add(estimateLineRecord); //save new estimate lines in DB. In our example, 2 new estimate lines are saved
                    }
                }

                if (await _repository.SaveChangesAsync()) return Ok(updatedEstimateVM);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }

            return BadRequest("Your request is invalid.");
        }

        /*I added delete method because, while I see value in keeping estimates on the system, the rest of the team has not been
        convinced and we did say the discussions of the estimate meeting were final so I don't expect them to change their minds.
        I also just want to be able to delete any estimates I make for testing purposes */
        [HttpDelete]
        [Route("DeleteEstimate/{estimateId}")]
        public async Task<IActionResult> DeleteEstimate(int estimateId)
        {
            try
            {
                var existingEstimate = await _repository.GetEstimateAsync(estimateId); //get estimate
                if (existingEstimate == null) return NotFound($"The estimate does not exist on the B.O.X System");

                var existingEstimateLines = await _repository.GetEstimateLinesByEstimateAsync(estimateId); //get this estimate's lines
                if (existingEstimateLines == null) return NotFound($"The estimate does not exist on the B.O.X System");

                //delete estimates lines
                foreach (var line in existingEstimateLines)
                {
                    _repository.Delete(line);
                }

                _repository.Delete(existingEstimate); //delete estimate

                if (await _repository.SaveChangesAsync()) return Ok(existingEstimate);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpPut]
        [Route("UpdateEstimateStatus/{estimateId}/{statusId}")]
        public async Task<IActionResult> UpdateEstimateStatus(int estimateId, int statusId)
        {
            try
            {

                var existingEstimate = await _repository.GetEstimateAsync(estimateId); //get estimate
                var existingStatus = await _repository.GetEstimateStatusAsync(statusId); //make sure the status exists

                if (existingEstimate == null) return NotFound($"The estimate does not exist on the B.O.X System");
                if (existingStatus == null) return NotFound($"The estimate status does not exist on the B.O.X System");

                existingEstimate.EstimateStatusID = statusId; //update status

                // Update the Estimate in the repository
                await _repository.UpdateEstimateAsync(existingEstimate);

                return Ok(existingEstimate);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }
    }
}
