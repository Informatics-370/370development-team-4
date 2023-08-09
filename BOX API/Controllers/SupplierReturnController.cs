using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class SupplierReturnController : ControllerBase
	{
		private readonly IRepository _repository;

		public SupplierReturnController(IRepository repository)
		{
			_repository = repository;
		}

		[HttpGet]
		[Route("GetAllSupplierReturns")]
		public async Task<IActionResult> GetAllSupplierReturns()
		{
			try
			{
				var results = await _repository.GetAllSupplierReturnsAsync();
				return Ok(results);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
			}
		}

		[HttpGet]
		[Route("GetSupplierReturn/{supplierReturnId}")]
		public async Task<IActionResult> GetSupplierReturnAsync(int supplierReturnId)
		{
			try
			{
				var result = await _repository.GetSupplierReturnAsync(supplierReturnId);

				if (result == null) return NotFound("Customer Order Status does not exist on system");

				return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support");
			}
		}

		[HttpPost]
		[Route("AddSupplierReturn")]
		public async Task<IActionResult> AddSupplierReturn(SupplierReturnViewModel srVM)
		{
			var supplierReturn = new Supplier_Return { Date = DateTime.Now, Quantity= srVM.Quantity };

			try
			{
				_repository.Add(supplierReturn);
				await _repository.SaveChangesAsync();
			}
			catch (Exception)
			{
				return BadRequest("Invalid transaction");
			}

			return Ok(supplierReturn);
		}

		//[HttpPut]
		//[Route("EditSupplierReturn/{supplierReturnId}")]
		//public async Task<ActionResult<CustomerOrderStatusViewModel>> EditSupplierReturn(int supplierReturnId, SupplierReturnViewModel srVM)
		//{
		//	try
		//	{
		//		var existingSupplierReturn = await _repository.GetSupplierReturnAsync(supplierReturnId);
		//		if (existingSupplierReturn == null) return NotFound($"The Supplier Return does not exist on the BOX System");


		//		existingSupplierReturn.Date = srVM.Date;
		//		existingSupplierReturn.Quantity = srVM.Quantity;

		//		if (await _repository.SaveChangesAsync())
		//		{
		//			return Ok(existingSupplierReturn);
		//		}
		//	}
		//	catch (Exception)
		//	{
		//		return StatusCode(500, "Internal Server Error. Please contact BOX support.");
		//	}
		//	return BadRequest("Your request is invalid.");
		//}
	}
}


