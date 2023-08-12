using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class QuoteDurationController : ControllerBase
    {
        private readonly IRepository _repository;

        public QuoteDurationController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetAllQuoteDurations")]
        public async Task<IActionResult> GetAllQuoteDurations()
        {
            try
            {
                var results = await _repository.GetAllQuoteDurationsAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
            }
        }

        [HttpGet]
        [Route("GetQuoteDuration/{quotedurationId}")]
        public async Task<IActionResult> GetQuoteDurationAsync(int quotedurationId)
        {
            try
            {
                var result = await _repository.GetQuoteDurationAsync(quotedurationId);

                if (result == null) return NotFound("Quote Duration does not exist on system");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact BOX support");
            }
        }

        [HttpPost]
        [Route("AddQuoteDuration")]
        public async Task<IActionResult> AddQuoteDuration(QuoteDurationViewModel evm)
        {
            var quoteduration = new Quote_Duration { Duration = evm.Duration };

            try
            {
                _repository.Add(quoteduration);
                await _repository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }

            return Ok(quoteduration);
        }

        [HttpPut]
        [Route("EditQuoteDuration/{quotedurationId}")]
        public async Task<ActionResult<QuoteDurationViewModel>> EditQuoteDuration(int quotedurationId, QuoteDurationViewModel quoteModel)
        {
            try
            {
                var existingquoteduration = await _repository.GetQuoteDurationAsync(quotedurationId);
                if (existingquoteduration == null) return NotFound($"The Quote Duration does not exist on the BOX System");


                existingquoteduration.Duration = quoteModel.Duration;


                if (await _repository.SaveChangesAsync())
                {
                    return Ok(existingquoteduration);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact BOX support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteQuoteDuration/{quotedurationId}")]
        public async Task<IActionResult> DeleteQuoteDuration(int quotedurationId)
        {
            try
            {
                var existingquoteduration = await _repository.GetQuoteDurationAsync(quotedurationId);

                if (existingquoteduration == null) return NotFound($"The Quote Duration does not exist on the BOX System");

                _repository.Delete(existingquoteduration);

                if (await _repository.SaveChangesAsync()) return Ok(existingquoteduration);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }


    }
}
