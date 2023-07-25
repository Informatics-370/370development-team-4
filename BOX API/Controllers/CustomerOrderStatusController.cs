using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class CustomerOrderStatusController : ControllerBase
	{
		private readonly IRepository _repository;

		public CustomerOrderStatusController(IRepository repository)
		{
			_repository = repository;
		}

		[HttpGet]
		[Route("GetAllCustomerOrderStatuses")]
		public async Task<IActionResult> GetAllCustomerOrderStatuses()
		{
			try
			{
				var results = await _repository.GetAllCustomerOrderStatusesAsync();
				return Ok(results);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
			}
		}

		[HttpGet]
		[Route("GetCustomerOrderStatus/{customerOrderstatusId}")]
		public async Task<IActionResult> GetCustomerOrderStatusAsync(int customerOrderstatusId)
		{
			try
			{
				var result = await _repository.GetCustomerOrderStatusAsync(customerOrderstatusId);

				if (result == null) return NotFound("Customer Order Status does not exist on system");

				return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support");
			}
		}

		[HttpPost]
		[Route("AddCustomerOrderStatus")]
		public async Task<IActionResult> AddCustomerOrderStatus(CustomerOrderStatusViewModel cosVM)
		{
			var cusOrderstatus = new Customer_Order_Status { Description = cosVM.Description };

			try
			{
				_repository.Add(cusOrderstatus);
				await _repository.SaveChangesAsync();
			}
			catch (Exception)
			{
				return BadRequest("Invalid transaction");
			}

			return Ok(cusOrderstatus);
		}

		[HttpPut]
		[Route("EditCustomerOrderStatus/{customerOrderStatusId}")]
		public async Task<ActionResult<CustomerOrderStatusViewModel>> EditCustomerOrderStatus(int customerOrderStatusId, CustomerOrderStatusViewModel esvm)
		{
			try
			{
				var existingCusOrdStatus = await _repository.GetCustomerOrderStatusAsync(customerOrderStatusId);
				if (existingCusOrdStatus == null) return NotFound($"The Customer Order Status does not exist on the BOX System");


				existingCusOrdStatus.Description = esvm.Description;


				if (await _repository.SaveChangesAsync())
				{
					return Ok(existingCusOrdStatus);
				}
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support.");
			}
			return BadRequest("Your request is invalid.");
		}

		[HttpDelete]
		[Route("DeleteCustomerOrderStatus/{customerOrderstatusId}")]
		public async Task<IActionResult> DeleteEstimDeleteCustomerOrderStatus(int customerOrderstatusId)
		{
			try
			{
				var existingCustomerOrderStatus = await _repository.GetCustomerOrderStatusAsync(customerOrderstatusId);

				if (existingCustomerOrderStatus == null) return NotFound($"The Customer Order Status does not exist on the BOX System");

				_repository.Delete(existingCustomerOrderStatus);

				if (await _repository.SaveChangesAsync()) return Ok(existingCustomerOrderStatus);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact support.");
			}
			return BadRequest("Your request is invalid.");
		}


	}
}


