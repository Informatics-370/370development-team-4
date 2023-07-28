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
	public class DeliveryScheduleController : ControllerBase
	{
		private readonly IRepository _repository;

		public DeliveryScheduleController(IRepository repository)
		{
			_repository = repository;
		}

		//-------------------------------------------------- Get All Order Delivery Schedules --------------------------------------------------
		[HttpGet]
		[Route("GetAllOrderDeliverySchedules")]
		public async Task<IActionResult> GetAllOrderDeliverySchedules()
		{
			try
			{
				var delSchedules = await _repository.GetAllCustomerOrderDeliverySchedulesAsync();

				List<DeliveryScheduleViewModel> DeliveryScheduleViewModels = new List<DeliveryScheduleViewModel>();
				foreach (var schedule in delSchedules)
				{
					var employee = await _repository.GetEmployeeAsync(schedule.EmployeeID); //get Employee


					DeliveryScheduleViewModel dsVM = new DeliveryScheduleViewModel()
					{
						OrderDeliveryScheduleID = schedule.OrderDeliveryScheduleID,
						EmployeeID = schedule.EmployeeID,
						Date = schedule.Date
						

					};
					DeliveryScheduleViewModels.Add(dsVM);
				}


				return Ok(DeliveryScheduleViewModels);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}

		}


		//-------------------------------------------------- Get Estimate By ID ------------------------------------------------
		[HttpGet]
		[Route("GetCustomerOrderDeliverySchedule/{orderDeliveryScheduleId}")]
		public async Task<IActionResult> GetCustomerOrderDeliverySchedule(int orderDeliveryScheduleId)
		{
			try
			{
				var delSchedule = await _repository.GetCustomerOrderDeliveryScheduleAsync(orderDeliveryScheduleId);


				if (delSchedule == null)
					return NotFound("Order Delivery Schedule not found");

				var DeliveryScheduleViewModel = new DeliveryScheduleViewModel
				{
					OrderDeliveryScheduleID = delSchedule.OrderDeliveryScheduleID,
					EmployeeID = delSchedule.EmployeeID,
					Date = delSchedule.Date

				};

				return Ok(DeliveryScheduleViewModel);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		//-------------------------------------------------- Create Estimate  ----------------------------------------------------
		[HttpPost]
		[Route("AddCustomerOrderDeliverySchedule")]
		public async Task<IActionResult> AddCustomerOrderDeliverySchedule([FromBody] DeliveryScheduleViewModel deliveryScheduleViewModel)
		{
			try
			{
				var delSchedule = new Order_Delivery_Schedule

				{
					OrderDeliveryScheduleID = deliveryScheduleViewModel.OrderDeliveryScheduleID,
					EmployeeID = deliveryScheduleViewModel.EmployeeID,
					Date = deliveryScheduleViewModel.Date
				};


				// Save the fixed product to the repository using the Add method
				_repository.Add(delSchedule);

				// Save changes in the repository
				await _repository.SaveChangesAsync();

				// Return the created Estimate 
				var createdDeliveryScheduleViewModel = new DeliveryScheduleViewModel
				{
					OrderDeliveryScheduleID = delSchedule.OrderDeliveryScheduleID,
					EmployeeID = delSchedule.EmployeeID,
					Date = delSchedule.Date

				};

				return Ok(createdDeliveryScheduleViewModel);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		//--------------------------------------------------UPDATE ESTIMATE--------------------------------------------
		[HttpPut]
		[Route("UpdateCustomerOrderDeliveryScheduleAsync/{orderDeliveryScheduleId}")]
		public async Task<IActionResult> UpdateCustomerOrderDeliverySchedule(int orderDeliveryScheduleId, [FromBody] DeliveryScheduleViewModel deliveryScheduleViewModel)
		{
			try
			{
				// Retrieve the existing estimate from the database
				var existingDelSchedule = await _repository.GetCustomerOrderDeliveryScheduleAsync(deliveryScheduleViewModel.OrderDeliveryScheduleID);

				if (existingDelSchedule == null)
				{
					return NotFound("Order Delivery Schedule not found");
				}



				// Update the other properties of the order del schedule

				existingDelSchedule.OrderDeliveryScheduleID = deliveryScheduleViewModel.OrderDeliveryScheduleID;
				existingDelSchedule.EmployeeID = deliveryScheduleViewModel.EmployeeID;
				existingDelSchedule.Date = deliveryScheduleViewModel.Date;


				// Update the Estimate  in the repository
				await _repository.UpdateCustomerOrderDeliveryScheduleAsync(existingDelSchedule);

				// Return the updated fixed product
				var updatedCustomerOrderDeliveryViewModel = new DeliveryScheduleViewModel
				{
					
					OrderDeliveryScheduleID = existingDelSchedule.OrderDeliveryScheduleID,
					EmployeeID = existingDelSchedule.EmployeeID,
					Date = existingDelSchedule.Date

				};

				return Ok(updatedCustomerOrderDeliveryViewModel);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}





	}
}
