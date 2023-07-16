using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System.Drawing;
using System.IO;


namespace BOX.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EstimateLineController : ControllerBase
  {
    private readonly IRepository _repository;

    public EstimateLineController(IRepository repository)
    {
      _repository = repository;
    }

    //-------------------------------------------------- Get All Estimate Lines--------------------------------------------------
    [HttpGet]
    [Route("GetAllEstimateLines")]
    public async Task<IActionResult> GetAllEstimateLines()
    {
      try
      {
        var estimateLines = await _repository.GetAllEstimateLinesAsync();

        List<EstimateLineViewModel> estimateLineViewModels = new List<EstimateLineViewModel>();
        foreach (var estimate in estimateLines)
        {
          //var estimateDuration = await _repository.GetEstimateDurationAsync(estimate.Estimate.EstimateDurationID); //get Estimate Duration
          //var Status = await _repository.GetEstimateStatusAsync(estimate.Estimate.EstimateStatusID);
          //var Duration = await _repository.GetEstimateDurationAsync(estimate.Estimate.EstimateDurationID);
          //var FixedProduct = await _repository.GetFixedProductAsync(estimate.FixedProductID);
          EstimateLineViewModel elVM = new EstimateLineViewModel()
          {
            EstimateID = estimate.EstimateID,
            customerID = estimate.CustomerID,
            FixedProductID = estimate.FixedProductID,
            AdminID = estimate.AdminID,
            //EstimateDurationNumber = Duration.Duration,
            //EstimateStatusDescription = Status.Description,
            //Confirmed_Unit_Price = estimate.Confirmed_Unit_Price,
            //FixedProductName = FixedProduct.Description

          };
          estimateLineViewModels.Add(elVM);
        }


        return Ok(estimateLineViewModels);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
      }
    }



    //-------------------------------------------------- Get Estimate Line By Concatenated ID ------------------------------------------------
    [HttpGet]
    [Route("GetEstimateLine/{estimateId}/{customerId}")]
    public async Task<IActionResult> GetEstimateLine(int estimateId, int customerId)
    {
      try
      {
        var estimateline = await _repository.GetEstimateLineAsync(estimateId, customerId);

        if (estimateline == null)
          return NotFound("Estimate Line not found");

        var EstimateLineViewModel = new EstimateLineViewModel
        {
          EstimateID = estimateline.EstimateID,
          customerID = estimateline.CustomerID

        };

        return Ok(EstimateLineViewModel);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
      }
    }



    //-------------------------------------------------- Create Estimate Line  ----------------------------------------------------
    [HttpPost]
    [Route("AddEstimateLine")]
    public async Task<IActionResult> AddEstimateLine([FromBody] EstimateLineViewModel estimateLineViewModel)
    {
      try
      {
        
        var customer = await _repository.GetCustomerAsync(estimateLineViewModel.customerID);
        var admin = await _repository.GetAdminAsync(estimateLineViewModel.AdminID);
        if (customer == null)
        {
          return NotFound("Customer with the given customerID does not exist.");
        }
        if (admin==null)
        {
          return NotFound("Admin with the given Admin ID does not exist.");

        }

        var estimateLine = new Estimate_Line
        {
          EstimateID = estimateLineViewModel.EstimateID,
          CustomerID = estimateLineViewModel.customerID,
          AdminID=estimateLineViewModel.AdminID,
          FixedProductID = estimateLineViewModel.FixedProductID,
          // Populate the navigation property
          Customer = customer,
          Admin = admin
        };

        // Save the fixed product to the repository using the Add method
        _repository.Add(estimateLine);

        // Save changes in the repository
        await _repository.SaveChangesAsync();

        // Return the created Estimate 
        var createdEstimateLineViewModel = new EstimateLineViewModel
        {
          EstimateID = estimateLine.EstimateID,
          customerID = estimateLineViewModel.customerID
        };

        return Ok(createdEstimateLineViewModel);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
      }
    }

    //--------------------------------------------------------------------Update Estimate Line----------------------------------------

    [HttpPut]
    [Route("UpdateEstimateLine/{estimateId}/{customerId}")]
    public async Task<IActionResult> UpdateEstimateLine(int estimateId, int customerId,[FromBody] EstimateLineViewModel updatedEstimateLineViewModel)
    {
      try
      {
        // Get the existing estimate line from the repository
        var existingEstimateLine = await _repository.GetEstimateLineAsync(updatedEstimateLineViewModel.EstimateID, updatedEstimateLineViewModel.customerID);

        // If the estimate line does not exist, return NotFound
        if (existingEstimateLine == null)
        {
          return NotFound("Estimate line with the given EstimateID and customerID does not exist.");
        }

       

        // Update the properties of the existing estimate line
        existingEstimateLine.FixedProductID = updatedEstimateLineViewModel.FixedProductID;
        existingEstimateLine.AdminID = updatedEstimateLineViewModel.AdminID;
        existingEstimateLine.Confirmed_Unit_Price = updatedEstimateLineViewModel.Confirmed_Unit_Price;

     

        // Save changes in the repository
        await _repository.SaveChangesAsync();

        // Return the updated EstimateLineViewModel
        var updatedEstimateLine = new EstimateLineViewModel
        {
          EstimateID = existingEstimateLine.EstimateID,
          customerID = existingEstimateLine.CustomerID,
          FixedProductID = existingEstimateLine.FixedProductID,
          AdminID = existingEstimateLine.AdminID,
          Confirmed_Unit_Price = existingEstimateLine.Confirmed_Unit_Price
       
        };

        return Ok(updatedEstimateLine);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
      }
    }



  }
}
