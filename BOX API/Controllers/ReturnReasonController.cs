using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class ReturnReasonController : ControllerBase
	{
		private readonly IRepository _repository;

		public ReturnReasonController(IRepository repository)
		{
			_repository = repository;
		}

		[HttpGet]
		[Route("GetAllCustomerRefundReasons")]
		public async Task<IActionResult> GetAllCustomerRefundReasons()
		{
			try
			{
				var results = await _repository.GetAllCustomerReturnReasonsAsync();
				return Ok(results);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
			}
		}

		[HttpGet]
		[Route("GetCustomerRefundReason/{customerrefundreasonId}")]
		public async Task<IActionResult> GetCustomerRefundReasonAsync(int customerrefundreasonId)
		{
			try
			{
				var result = await _repository.GetCustomerReturnReasonAsync(customerrefundreasonId);

				if (result == null) return NotFound("Customer Refund Reason does not exist on system");

				return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support");
			}
		}

		[HttpPost]
		[Route("AddRefundReason")]
		public async Task<IActionResult> AddRefundReason(RefundReasonViewModel rrvm)
		{
			var customerrefundreason = new Customer_Return_Reason { Description=rrvm.Description};

			try
			{
				_repository.Add(customerrefundreason);
				await _repository.SaveChangesAsync();
			}
			catch (Exception)
			{
				return BadRequest("Invalid transaction");
			}

			return Ok(customerrefundreason);
		}

		[HttpPut]
		[Route("EditCustomerRefundReason/{customerrefundreasonId}")]
		public async Task<ActionResult<RefundReasonViewModel>> EditCustomerRefundReason(int customerrefundreasonId, RefundReasonViewModel refundreasonModel)
		{
			try
			{
				var existingrefundreason = await _repository.GetCustomerReturnReasonAsync(customerrefundreasonId);
				if (existingrefundreason == null) return NotFound($"The Refund Reason does not exist on the BOX System");


				existingrefundreason.Description = refundreasonModel.Description;
				

				if (await _repository.SaveChangesAsync())
				{
					return Ok(existingrefundreason);
				}
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support.");
			}
			return BadRequest("Your request is invalid.");
		}

		[HttpDelete]
		[Route("DeleteCustomerRefundReason/{customerrefundreasonId}")]
		public async Task<IActionResult> DeleteCustomerRefundReason(int customerrefundreasonId)
		{
			try
			{
				var existingRefundReason = await _repository.GetCustomerReturnReasonAsync(customerrefundreasonId);

				if (existingRefundReason == null) return NotFound($"The Customer Refund Reason does not exist on the BOX System");

				_repository.Delete(existingRefundReason);

				if (await _repository.SaveChangesAsync()) return Ok(existingRefundReason);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support.");
			}
			return BadRequest("Your request is invalid.");
		}


	}
}


