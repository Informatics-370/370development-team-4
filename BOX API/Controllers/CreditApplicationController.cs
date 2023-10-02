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

        //---------------------------------- GET ALL CREDIT APPLICATIONS ------------------------------
        [HttpGet]
        [Route("GetCreditApplications")]
        public async Task<IActionResult> GetCreditApplications()
        {
            try
            {
                var results = await _repository.GetCreditApplicationsAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //---------------------------------- SUBMIT APPLICATION ------------------------------
        [HttpPost]
        [Route("SubmitApplication")]
        public async Task<IActionResult> SubmitApplication([FromBody] CreditApplicationViewModel creditAppVM)
        {
            try
            {
                var file = creditAppVM.Application_Pdf64; // Get the uploaded file directly

                if (file != null && file.Length > 0)
                {
                    // Read the uploaded PDF file as a byte array
                    using (var memoryStream = new MemoryStream())
                    {
                        //await file.CopyToAsync(memoryStream);
                        //byte[] pdfBytes = memoryStream.ToArray();

                        // Create a new credit application for a user
                        var creditApplication = new Credit_Application
                        {
                            CreditApplicationStatusID = 1,
                            UserId = creditAppVM.UserId,
                            Application_Pdf = Convert.FromBase64String(creditAppVM.Application_Pdf64)
                        };

                        // Save the credit application to the repository using the Add method
                        _repository.Add(creditApplication);
                        await _repository.SaveChangesAsync();

                        // Return the created credit application
                        var CreditAppViewModel = new CreditApplicationViewModel
                        {
                            CreditApplicationID = creditApplication.creditApplicationID,
                            CreditApplicationStatusID = creditApplication.CreditApplicationStatusID,
                            UserId = creditApplication.UserId,
                            // You can omit Application_Pdf64 as you are storing it in the database
                        };

                        return Ok(CreditAppViewModel);
                    }
                }
                else
                {
                    return BadRequest("No PDF file uploaded.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }
        //---------------------------------- UPLOAD APPLICATION (ADMIN) ------------------------------
        private readonly string _fileStoragePath = Path.Combine(Directory.GetCurrentDirectory(), "CreditApplicationForm");

        [HttpPost]
        [Route("UploadApplication")]
        public async Task<IActionResult> UploadApplication(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            string filePath = Path.Combine(_fileStoragePath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok("File uploaded successfully.");
        }

        [HttpGet]
        [Route("download/{fileName}")]
        public IActionResult DownloadFile(string fileName)
        {
            string filePath = Path.Combine(_fileStoragePath, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found.");

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, "application/pdf", fileName);
        }
    }
}
