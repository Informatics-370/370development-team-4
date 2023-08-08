using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class QuoteDurationController : ControllerBase
	{
		private readonly IRepository _repository;

		public QuoteDurationController(IRepository repository)
		{
			_repository = repository;
		}

		[HttpGet]
		[Route("GetAllEstimateDurations")]
		public async Task<IActionResult> GetAllEstimateDurations()
		{
			try
			{
				var results = await _repository.GetAllQuoteDurationsAsync();
				return Ok(results);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
			}
		}

		[HttpGet]
		[Route("GetEstimateDuration/{estimatedurationId}")]
		public async Task<IActionResult> GetEstimateDurationAsync(int estimatedurationId)
		{
			try
			{
				var result = await _repository.GetQuoteDurationAsync(estimatedurationId);

				if (result == null) return NotFound("Estimate Duration does not exist on system");

				return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support");
			}
		}

		[HttpPost]
		[Route("AddEstimateDuration")]
		public async Task<IActionResult> AddEstimateDuration(EstimateDurationViewModel evm)
		{
			var estimateduration = new Quote_Duration { Duration=evm.Duration};

			try
			{
				_repository.Add(estimateduration);
				await _repository.SaveChangesAsync();
			}
			catch (Exception)
			{
				return BadRequest("Invalid transaction");
			}

			return Ok(estimateduration);
		}

		[HttpPut]
		[Route("EditEstimateDuration/{estimatedurationId}")]
		public async Task<ActionResult<EstimateDurationViewModel>> EditEstimateDuration(int estimatedurationId, EstimateDurationViewModel estimateModel)
		{
			try
			{
				var existingestimateduration = await _repository.GetQuoteDurationAsync(estimatedurationId);
				if (existingestimateduration == null) return NotFound($"The Estimate Duration does not exist on the BOX System");


				existingestimateduration.Duration = estimateModel.Duration;
				

				if (await _repository.SaveChangesAsync())
				{
					return Ok(existingestimateduration);
				}
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support.");
			}
			return BadRequest("Your request is invalid.");
		}

		[HttpDelete]
		[Route("DeleteEstimateDuration/{estimatedurationId}")]
		public async Task<IActionResult> DeleteEstimateDuration(int estimatedurationId)
		{
			try
			{
				var existingestimateduration = await _repository.GetQuoteDurationAsync(estimatedurationId);

				if (existingestimateduration == null) return NotFound($"The Estimate Duration does not exist on the BOX System");

				_repository.Delete(existingestimateduration);

				if (await _repository.SaveChangesAsync()) return Ok(existingestimateduration);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact support.");
			}
			return BadRequest("Your request is invalid.");
		}


	}
}


