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

        List<EstimateViewModel> EstimateViewModels = new List<EstimateViewModel>();
        foreach (var estimate in estimates)
        {
          var estimateDuration = await _repository.GetEstimateDurationAsync(estimate.EstimateDurationID); //get Estimate Duration
          var Status = await _repository.GetEstimateStatusAsync(estimate.EstimateStatusID);
          var Duration = await _repository.GetEstimateDurationAsync(estimate.EstimateDurationID);

          EstimateViewModel eVM = new EstimateViewModel()
          {
            EstimateID = estimate.EstimateID,
            EstimateStatusID = estimate.EstimateStatusID,
            EstimateDurationID = estimate.EstimateDurationID,
            EstimateDurationNumber=Duration.Duration,
            EstimateStatusDescription = Status.Description

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


        if (estimate == null)
          return NotFound("Estimate not found");

        var EstimateViewModel = new EstimateViewModel
        {
          EstimateID = estimate.EstimateID,
           EstimateStatusID = estimate.EstimateStatusID,
           EstimateDurationID = estimate.EstimateDurationID
        };

        return Ok(EstimateViewModel);
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
      try
      {
        // Create a new instance of Fixed_Product from the view model
        var estimate = new Estimate

        {
             EstimateID = estimateViewModel.EstimateID,
            EstimateStatusID = estimateViewModel.EstimateStatusID,
            EstimateDurationID = estimateViewModel.EstimateDurationID
        };

       
        // Save the fixed product to the repository using the Add method
        _repository.Add(estimate);

        // Save changes in the repository
        await _repository.SaveChangesAsync();

       // Return the created Estimate 
        var createdEstimateViewModel = new EstimateViewModel
        {
          EstimateID = estimate.EstimateID,
          EstimateStatusID = estimate.EstimateStatusID,
          EstimateDurationID = estimate.EstimateDurationID
        };

        return Ok(createdEstimateViewModel);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
      }
    }

    //--------------------------------------------------UPDATE ESTIMATE--------------------------------------------
    [HttpPut]
    [Route("UpdateEstimate/{estimateId}")]
    public async Task<IActionResult> UpdateEstimate(int estimateId, [FromBody] EstimateViewModel estimateViewModel)
    {
      try
      {
        // Retrieve the existing estimate from the database
        var existingEstimate = await _repository.GetEstimateAsync(estimateViewModel.EstimateID);

        if (existingEstimate == null)
        {
          return NotFound("Estimate not found");
        }



        // Update the other properties of the fixed product
        existingEstimate.EstimateDurationID = estimateViewModel.EstimateDurationID;
        existingEstimate.EstimateStatusID = estimateViewModel.EstimateStatusID;
        
        // Update the Estimate  in the repository
        await _repository.UpdateEstimateAsync(existingEstimate);

        // Return the updated fixed product
        var updatedEstimateViewModel = new EstimateViewModel
        {
          EstimateID = existingEstimate.EstimateID,
          EstimateStatusID = existingEstimate.EstimateStatusID,
          EstimateDurationID = existingEstimate.EstimateDurationID
      
        };

        return Ok(updatedEstimateViewModel);
      }
      catch (Exception)
      {
        return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
      }
    }





  }
}
