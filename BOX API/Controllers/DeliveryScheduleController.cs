using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;


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
                    //var employee = await _repository.GetEmployeeAsync(schedule.EmployeeID); //get Employee


                    DeliveryScheduleViewModel dsVM = new DeliveryScheduleViewModel()
                    {
                        OrderDeliveryScheduleID = schedule.OrderDeliveryScheduleID,
                        DriverId = schedule.UserId,
                        Date = schedule.Date.ToString()
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
                    DriverId = delSchedule.UserId,
                    Date = delSchedule.Date.ToString()
                };

                return Ok(DeliveryScheduleViewModel);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpPost]
        [Route("AddCustomerOrderDeliverySchedule")]
        public async Task<IActionResult> AddCustomerOrderDeliverySchedule([FromBody] DeliveryScheduleViewModel deliveryScheduleViewModel)
        {
            try
            {
                var delSchedule = new Order_Delivery_Schedule

                {
                    OrderDeliveryScheduleID = deliveryScheduleViewModel.OrderDeliveryScheduleID,
                    UserId = deliveryScheduleViewModel.DriverId,
                    //Date = deliveryScheduleViewModel.Date
                };


                // Save the fixed product to the repository using the Add method
                _repository.Add(delSchedule);

                // Save changes in the repository
                await _repository.SaveChangesAsync();

                return Ok(delSchedule);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpPut]
        [Route("UpdateCustomerOrderDeliveryScheduleAsync/{orderDeliveryScheduleId}")]
        public async Task<IActionResult> UpdateCustomerOrderDeliverySchedule(int orderDeliveryScheduleId, [FromBody] DeliveryScheduleViewModel deliveryScheduleViewModel)
        {
            try
            {
                // Retrieve the existing schedule from the database
                var existingDelSchedule = await _repository.GetCustomerOrderDeliveryScheduleAsync(deliveryScheduleViewModel.OrderDeliveryScheduleID);

                if (existingDelSchedule == null)
                {
                    return NotFound("Order Delivery Schedule not found");
                }

                // Update the properties of the order del schedule
                existingDelSchedule.OrderDeliveryScheduleID = deliveryScheduleViewModel.OrderDeliveryScheduleID;
                existingDelSchedule.UserId = deliveryScheduleViewModel.DriverId;
                //existingDelSchedule.Date = deliveryScheduleViewModel.Date;

                // Update the schedule in the repository
                await _repository.UpdateCustomerOrderDeliveryScheduleAsync(existingDelSchedule);

                return Ok(existingDelSchedule);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }
    }
}
