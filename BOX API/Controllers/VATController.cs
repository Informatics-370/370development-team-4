using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class VATController : ControllerBase
	{
		private readonly IRepository _repository;

		public VATController(IRepository repository)
		{
			_repository = repository;
		}

		[HttpGet]
		[Route("GetAllVATs")]
		public async Task<IActionResult> GetAllVATs()
		{
			try
			{
				var results = await _repository.GetAllVatAsync();
				return Ok(results);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
			}
		}

		[HttpGet]
		[Route("GetVat/{vatId}")]
		public async Task<IActionResult> GetVatAsync(int vatId)
		{
			try
			{
				var result = await _repository.GetVatAsync(vatId);

				if (result == null) return NotFound("VAT does not exist on system");

				return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support");
			}
		}

		[HttpPost]
		[Route("AddVat")]
		public async Task<IActionResult> AddVat(VATViewModel vvm)
		{
			var valt = new VAT { Percentage=vvm.Percentage};

			try
			{
				_repository.Add(valt);
				await _repository.SaveChangesAsync();
			}
			catch (Exception)
			{
				return BadRequest("Invalid transaction");
			}

			return Ok(valt);
		}

		[HttpPut]
		[Route("EditVat/{vatId}")]
		public async Task<ActionResult<VATViewModel>> EditVat(int vatId, VATViewModel vvm)
		{
			try
			{
				var existingvat = await _repository.GetVatAsync(vatId);
				if (existingvat == null) return NotFound($"The VAT does not exist on the BOX System");


				existingvat.Percentage = vvm.Percentage;
				

				if (await _repository.SaveChangesAsync())
				{
					return Ok(existingvat);
				}
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support.");
			}
			return BadRequest("Your request is invalid.");
		}

		[HttpDelete]
		[Route("DeleteVat/{vatId}")]
		public async Task<IActionResult> DeleteVat(int vatId)
		{
			try
			{
				var existingvat = await _repository.GetVatAsync(vatId);

				if (existingvat == null) return NotFound($"The Vat does not exist on the BOX System");

				_repository.Delete(existingvat);

				if (await _repository.SaveChangesAsync()) return Ok(existingvat);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact support.");
			}
			return BadRequest("Your request is invalid.");
		}


	}
}


