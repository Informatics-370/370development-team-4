using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;

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
		[Route("GetAllVAT")]
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

		//GET THE VAT THAT IS APPLICABLE i.e. VAT WITH MOST RECENT DATE
		[HttpGet]
		[Route("GetVAT")]
		public async Task<IActionResult> GetVatAsync()
		{
			try
			{
				var result = await _repository.GetVatAsync();

				if (result == null) return NotFound("VAT does not exist on system");

				return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support");
			}
		}

		[HttpPost]
		[Route("AddVAT")]
		public async Task<IActionResult> AddVat(VAT newVAT)
		{
			var valt = new VAT { Percentage=newVAT.Percentage, Date = DateTime.Now };

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
	}
}


