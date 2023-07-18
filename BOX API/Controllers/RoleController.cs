//using BOX.Models;
//using BOX.ViewModel;
//using Microsoft.AspNetCore.Mvc;

//// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
////
//namespace BOX.Controllers
//{

//  [Route("api/[controller]")]
//  [ApiController]
//  public class EstimateStatusController : ControllerBase
//  {
//    private readonly IRepository _repository;

//    public EstimateStatusController(IRepository repository)
//    {
//      _repository = repository;
//    }

//    [HttpGet]
//    [Route("GetAllEstimateStatuses")]
//    public async Task<IActionResult> GetAllEstimateStatuses()
//    {
//      try
//      {
//        var results = await _repository.GetAllEstimateStatusesAsync();
//        return Ok(results);
//      }
//      catch (Exception)
//      {
//        return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
//      }
//    }

//    [HttpGet]
//    [Route("GetEstimateStatus/{estimatestatusId}")]
//    public async Task<IActionResult> GetEstimateStatusAsync(int estimatestatusId)
//    {
//      try
//      {
//        var result = await _repository.GetEstimateStatusAsync(estimatestatusId);

//        if (result == null) return NotFound("Estimate Duration does not exist on system");

//        return Ok(result);
//      }
//      catch (Exception)
//      {
//        return StatusCode(500, "Internal Server Error. Please contact BOX support");
//      }
//    }

//    [HttpPost]
//    [Route("AddEstimateStatus")]
//    public async Task<IActionResult> AddEstimateStatus(EstimateStatusViewModel esvm)
//    {
//      var estimatestatus = new Estimate_Status { Description = esvm.Description };

//      try
//      {
//        _repository.Add(estimatestatus);
//        await _repository.SaveChangesAsync();
//      }
//      catch (Exception)
//      {
//        return BadRequest("Invalid transaction");
//      }

//      return Ok(estimatestatus);
//    }

//    [HttpPut]
//    [Route("EditEstimateStatus/{estimatestatusId}")]
//    public async Task<ActionResult<EstimateStatusViewModel>> EditEstimateStatus(int estimatestatusId, EstimateStatusViewModel esvm)
//    {
//      try
//      {
//        var existingestimatestatus = await _repository.GetEstimateStatusAsync(estimatestatusId);
//        if (existingestimatestatus == null) return NotFound($"The Estimate Status does not exist on the BOX System");


//        existingestimatestatus.Description = esvm.Description;


//        if (await _repository.SaveChangesAsync())
//        {
//          return Ok(existingestimatestatus);
//        }
//      }
//      catch (Exception)
//      {
//        return StatusCode(500, "Internal Server Error. Please contact BOX support.");
//      }
//      return BadRequest("Your request is invalid.");
//    }

//    [HttpDelete]
//    [Route("DeleteEstimateStatus/{estimatestatusId}")]
//    public async Task<IActionResult> DeleteEstimateStatus(int estimatestatusId)
//    {
//      try
//      {
//        var existingestimatestatus = await _repository.GetEstimateStatusAsync(estimatestatusId);

//        if (existingestimatestatus == null) return NotFound($"The Estimate Status does not exist on the BOX System");

//        _repository.Delete(existingestimatestatus);

//        if (await _repository.SaveChangesAsync()) return Ok(existingestimatestatus);

//      }
//      catch (Exception)
//      {
//        return StatusCode(500, "Internal Server Error. Please contact support.");
//      }
//      return BadRequest("Your request is invalid.");
//    }


//  }
//}


