using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreditApplicationController : ControllerBase
    {
        private readonly IRepository _repository;

        public CreditApplicationController(IRepository repository)
        {
            _repository = repository;
        }

        //========================== CREDIT APPLICATION STATUS ===============================

        //----------------------------------- CREATE -----------------------------------------
        [HttpPost]
        [Route("CreateStatus")]
        public async Task<IActionResult> CreateAppStatus(CreditApplicationStatusViewModel appVM)
        {
            var status = new Credit_Application_Status
            {
                CreditApplicationStatusID = appVM.CreditApplicationStatusId,
                Description = appVM.Description
            };

            try
            {
                _repository.Add(status);
                await _repository.SaveChangesAsync();

                return Ok(status);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        //------------------------------------ READ ------------------------------------------
        [HttpGet]
        [Route("GetAllStatuses")]
        public async Task<IActionResult> GetAllAppStatuses()
        {
            try
            {
                var results = await _repository.GetAllAppStatusesAsync();
                return Ok(results);
            }
            catch (Exception)
            { 
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }


        [HttpGet]
        [Route("GetAppStatus/{applicationId}")]
        public async Task<IActionResult> GetAppStatusAsync(int applicationId)
        {
            try
            {
                var result = await _repository.GetAppStatusAsync(applicationId);

                if (result == null) 
                    return NotFound("Credit Application Status does not exist on the system");

                return Ok(result);
            }
            catch (Exception)
            { 
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //----------------------------------- UPDATE -----------------------------------------
        [HttpPut]
        [Route("UpdateAppStatus/{applicationId}")]
        public async Task<ActionResult<CreditApplicationStatusViewModel>> UpdateAppStatus(int applicationId, CreditApplicationStatusViewModel statusVM)
        {
            try
            {
                //find the item
                var existingItem = await _repository.GetAppStatusAsync(applicationId);

                if (existingItem == null) 
                    return NotFound("The status does not exist on the B.O.X System");

                //update the item
                existingItem.Description = statusVM.Description;
                existingItem.CreditApplicationStatusID = statusVM.CreditApplicationStatusId;

                if (await _repository.SaveChangesAsync())
                    return Ok(statusVM);
            }
            catch (Exception)
            { 
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }

            return BadRequest("Your request is invalid.");
        }

        //----------------------------------- DELETE -----------------------------------------
        [HttpDelete]
        [Route("DeleteAppStatus/{applicationId}")]
        public async Task<IActionResult> DeleteAppStatus(int applicationId)
        {
            try
            {
                //find item
                var existingItem = await _repository.GetAppStatusAsync(applicationId);
                if (existingItem == null) 
                    return NotFound("The status does not exist on the B.O.X System");

                //delete item
                _repository.Delete(existingItem);
                if (await _repository.SaveChangesAsync()) 
                    return Ok(existingItem);
            }
            catch (Exception)
            { 
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support."); 
            }

            return BadRequest("Your request is invalid.");
        }


        //============================= CREDIT APPLICATION ===================================
    }
}
