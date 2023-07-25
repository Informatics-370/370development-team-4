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
	public class CustomerOrderController : ControllerBase
	{
		private readonly IRepository _repository;

		public CustomerOrderController(IRepository repository)
		{
			_repository = repository;
		}

		//-------------------------------------------------- Get All Custom Products --------------------------------------------------
		[HttpGet]
		[Route("GetAllCustomerOrders")]
		public async Task<IActionResult> GetAllCustomerOrders()
		{
			try
			{
				var customerOrders = await _repository.GetAllCustomerOrdersAsync();

				List<CustomerOrderViewModel> customerOrderViewModels = new List<CustomerOrderViewModel>();
				foreach (var co in customerOrders)
				{

					CustomerOrderViewModel coVM = new CustomerOrderViewModel()
					{
						CustomerOrderID = co.CustomerOrderID,
						CustomerStatusID = co.CustomerOrderStatusID,
						CustomerID = co.CustomerID,
						OrderDeliveryScheduleID = co.OrderDeliveryScheduleID,
						Date = co.Date,
						DeliveryPhoto = Convert.ToBase64String(co.Delivery_Photo)





					};
					customerOrderViewModels.Add(coVM);
				}

				return Ok(customerOrderViewModels);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		//-------------------------------------------------- Get Customer Order By ID ------------------------------------------------
		[HttpGet]
		[Route("GetCustomerOrder/{customerOrderId}")]
		public async Task<IActionResult> GetCustomerOrder(int customerOrderId)
		{
			try
			{
				var customerOrder = await _repository.GetCustomerOrderAsync(customerOrderId);

				if (customerOrder == null)
					return NotFound("Customer Order not found");

				var customerOrderViewModel = new CustomerOrderViewModel
				{
					CustomerOrderID = customerOrder.CustomerOrderID,
					CustomerStatusID = customerOrder.CustomerOrderStatusID,
					CustomerID = customerOrder.CustomerID,
					OrderDeliveryScheduleID = customerOrder.OrderDeliveryScheduleID,
					Date = customerOrder.Date,
					DeliveryPhoto = Convert.ToBase64String(customerOrder.Delivery_Photo)
				};

				return Ok(customerOrderViewModel);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		//-------------------------------------------------- Create Customer Order ----------------------------------------------------
		[HttpPost]
		[Route("CreateCustomerOrder")]
		public async Task<IActionResult> CreateCustomerOrder([FromBody] CustomerOrderViewModel customerOrderViewModel)
		{
			try
			{
				// Create a new instance of Customer Order from the view model
				var customerOrder = new Customer_Order
				{
					CustomerOrderID = customerOrderViewModel.CustomerOrderID,
					CustomerOrderStatusID = customerOrderViewModel.CustomerStatusID,
					CustomerID = customerOrderViewModel.CustomerID,
					OrderDeliveryScheduleID = customerOrderViewModel.OrderDeliveryScheduleID,
					Date = customerOrderViewModel.Date,
					Delivery_Photo = Convert.FromBase64String(customerOrderViewModel.DeliveryPhoto)
				};


				// Save the custom product to the repository using the Add method
				_repository.Add(customerOrder);

				// Save changes in the repository
				await _repository.SaveChangesAsync();

				// Return the created fixed product
				var createdCustomerOrderViewModel = new CustomerOrderViewModel
				{
					CustomerOrderID = customerOrder.CustomerOrderID,
					CustomerStatusID = customerOrder.CustomerOrderStatusID,
					CustomerID = customerOrder.CustomerID,
					OrderDeliveryScheduleID = customerOrder.OrderDeliveryScheduleID,
					Date = customerOrder.Date,
					//DeliveryPhoto = Convert.ToBase64String(customerOrder.Delivery_Photo)


				};

				return Ok(createdCustomerOrderViewModel);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		//-------------------------------------------------- Update Customer Order ----------------------------------------------------
		[HttpPut]
		[Route("UpdateCustomerOrder/{customerOrderId}")]
		public async Task<IActionResult> UpdateCustomerOrder(int customerOrderId, [FromBody] CustomerOrderViewModel customerOrderViewModel)
		{
			try
			{
				// Retrieve the existing Customer Order from the database
				var existingCustomerOrder = await _repository.GetCustomerOrderAsync(customerOrderViewModel.CustomerOrderID);

				if (existingCustomerOrder == null)
				{
					return NotFound("Customer Order not found");
				}


				// Update the other properties of the fixed product
				existingCustomerOrder.CustomerOrderID = customerOrderViewModel.CustomerOrderID;
				existingCustomerOrder.CustomerOrderStatusID = customerOrderViewModel.CustomerStatusID;
				existingCustomerOrder.CustomerID = customerOrderViewModel.CustomerID;
				existingCustomerOrder.OrderDeliveryScheduleID = customerOrderViewModel.OrderDeliveryScheduleID;
				existingCustomerOrder.Date = customerOrderViewModel.Date;
				existingCustomerOrder.Delivery_Photo = Convert.FromBase64String(customerOrderViewModel.DeliveryPhoto);

				// Update the fixed product in the repository
				await _repository.UpdateCustomerOrderAsync(existingCustomerOrder);

				// Return the updated custom product
				var updatedCustomerOrderViewModel = new CustomerOrderViewModel
				{
					CustomerOrderID = existingCustomerOrder.CustomerOrderID,
					CustomerStatusID = existingCustomerOrder.CustomerOrderStatusID,
					CustomerID = existingCustomerOrder.CustomerID,
					OrderDeliveryScheduleID = existingCustomerOrder.OrderDeliveryScheduleID,
					Date = existingCustomerOrder.Date,
					DeliveryPhoto = Convert.ToBase64String(existingCustomerOrder.Delivery_Photo)
				
				};

				return Ok(updatedCustomerOrderViewModel);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		[HttpDelete]
		[Route("DeleteCustomerOrder/{customerOrderId}")]
		public async Task<IActionResult> DeleteCustomerOrder(int customerOrderId)
		{
			try
			{
				var existingCustomerOrder = await _repository.GetCustomerOrderAsync(customerOrderId);

				if (existingCustomerOrder == null) return NotFound($"The Customer Order does not exist on the B.O.X System");

				_repository.Delete(existingCustomerOrder);


				if (await _repository.SaveChangesAsync()) return Ok(existingCustomerOrder);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
			}
			return BadRequest("Your request is invalid.");
		}


	}



}
