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
	public class BulkDiscountController : ControllerBase
	{
		private readonly IRepository _repository;

		public BulkDiscountController(IRepository repository)
		{
			_repository = repository;
		}

		[HttpGet]
		[Route("GetAllDiscounts")]
		public async Task<IActionResult> GetAllDiscounts()
		{
			try
			{
				var results = await _repository.GetAllDiscountsAsync();
				return Ok(results);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
			}
		}

		[HttpGet]
		[Route("GetDiscount/{discountId}")]
		public async Task<IActionResult> GetDiscountAsync(int discountId)
		{
			try
			{
				var result = await _repository.GetDiscountAsync(discountId);

				if (result == null) return NotFound("Discount does not exist on system");

				return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support");
			}
		}

		[HttpPost]
		[Route("AddDiscount")]
		public async Task<IActionResult> AddDiscount(Bulk_Discount newDiscount)
		{
			var disc = new Bulk_Discount { Percentage = newDiscount.Percentage, Quantity=newDiscount.Quantity };

			try
			{
				_repository.Add(disc);
				await _repository.SaveChangesAsync();
			}
			catch (Exception)
			{
				return BadRequest("Invalid transaction");
			}

			return Ok(disc);
		}

		[HttpPut]
		[Route("EditDiscount/{discountId}")]
		public async Task<ActionResult<Bulk_Discount>> EditVat(int discountId, Bulk_Discount updatedDiscount)
		{
			try
			{
				var existingDiscount = await _repository.GetDiscountAsync(discountId);
				if (existingDiscount == null) return NotFound($"The Discount does not exist on the BOX System");


				existingDiscount.Percentage = updatedDiscount.Percentage;
				existingDiscount.Quantity = updatedDiscount.Quantity;



				if (await _repository.SaveChangesAsync())
				{
					return Ok(existingDiscount);
				}
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support.");
			}
			return BadRequest("Your request is invalid.");
		}

		[HttpDelete]
		[Route("DeleteDiscount/{discountId}")]
		public async Task<IActionResult> DeleteDiscount(int discountId)
		{
			try
			{
				var existingDiscount = await _repository.GetDiscountAsync(discountId);

				if (existingDiscount == null) return NotFound($"The Discount does not exist on the BOX System");

				_repository.Delete(existingDiscount);

				if (await _repository.SaveChangesAsync()) return Ok(existingDiscount);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact support.");
			}
			return BadRequest("Your request is invalid.");
		}


	}
}


