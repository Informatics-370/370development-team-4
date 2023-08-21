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
        [Route("GetAllCustomerReturnReasons")]
        public async Task<IActionResult> GetAllCustomerReturnReasons()
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
        [Route("GetCustomerReturnReason/{customerreturnreasonId}")]
        public async Task<IActionResult> GetCustomerReturnReasonAsync(int customerreturnreasonId)
        {
            try
            {
                var result = await _repository.GetCustomerReturnReasonAsync(customerreturnreasonId);

                if (result == null) return NotFound("Customer Return Reason does not exist on system");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact BOX support");
            }
        }

        [HttpPost]
        [Route("AddReturnReason")]
        public async Task<IActionResult> AddReturnReason(ReturnReasonViewModel rrvm)
        {
            var customerreturnreason = new Customer_Return_Reason { Description = rrvm.Description };

            try
            {
                _repository.Add(customerreturnreason);
                await _repository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }

            return Ok(customerreturnreason);
        }

        [HttpPut]
        [Route("EditCustomerReturnReason/{customerreturnreasonId}")]
        public async Task<ActionResult<ReturnReasonViewModel>> EditCustomerReturnReason(int customerreturnreasonId, ReturnReasonViewModel returnreasonModel)
        {
            try
            {
                var existingreturnreason = await _repository.GetCustomerReturnReasonAsync(customerreturnreasonId);
                if (existingreturnreason == null) return NotFound($"The Return Reason does not exist on the BOX System");


                existingreturnreason.Description = returnreasonModel.Description;


                if (await _repository.SaveChangesAsync())
                {
                    return Ok(existingreturnreason);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact BOX support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteCustomerReturnReason/{customerreturnreasonId}")]
        public async Task<IActionResult> DeleteCustomerReturnReason(int customerreturnreasonId)
        {
            try
            {
                var existingReturnReason = await _repository.GetCustomerReturnReasonAsync(customerreturnreasonId);

                if (existingReturnReason == null) return NotFound($"The Customer Return Reason does not exist on the BOX System");

                _repository.Delete(existingReturnReason);

                if (await _repository.SaveChangesAsync()) return Ok(existingReturnReason);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact BOX support.");
            }
            return BadRequest("Your request is invalid.");
        }
    }
}
