using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class CostPriceFormulaVariablesController : Controller
    {
        private readonly IRepository _repository;

        public CostPriceFormulaVariablesController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetAllFormulaVariables")]
        public async Task<IActionResult> GetAllFormulaVariables()
        {
            try
            {
                var results = await _repository.GetAllFormulaVariablesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpGet]
        [Route("GetFormulaVariables/{formulaId}")]
        public async Task<IActionResult> GetFormulaVariablesAsync(int formulaId)
        {
            try
            {
                var result = await _repository.GetFormulaVariablesAsync(formulaId);

                if (result == null) return NotFound("The Formula variables do not exist on the B.O.X System");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support");
            }
        }

        [HttpPost]
        [Route("AddFormulaVariables")]
        public async Task<IActionResult> AddFormulaVariables(Cost_Price_Formula_Variables cpfv)
        {
            var newCPFV = cpfv;

            try
            {
                _repository.Add(newCPFV);
                await _repository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return BadRequest("Invalid transaction" + ex.Message + ex.InnerException);
            }

            return Ok(newCPFV);
        }

        [HttpPut]
        [Route("EditFormulaVariables/{formulaId}")]
        public async Task<ActionResult<Cost_Price_Formula_Variables>> EditFormulaVariables(int formulaId, Cost_Price_Formula_Variables updatedCPFV)
        {
            try
            {
                var existingCPFV = await _repository.GetFormulaVariablesAsync(formulaId);
                if (existingCPFV == null) return NotFound($"The Formula variables do not exist on the B.O.X System");

                existingCPFV.Box_Factor = updatedCPFV.Box_Factor;
                existingCPFV.Rate_Per_Ton = updatedCPFV.Rate_Per_Ton;

                if (await _repository.SaveChangesAsync())
                {
                    return Ok(existingCPFV);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support. " + ex.Message + " inner exception: " + ex.InnerException);
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteFormulaVariables/{formulaId}")]
        public async Task<IActionResult> DeleteFormulaVariables(int formulaId)
        {
            try
            {
                var existingCPFV = await _repository.GetFormulaVariablesAsync(formulaId);
                if (existingCPFV == null) return NotFound($"The Formula variables do not exist on the B.O.X System");

                _repository.Delete(existingCPFV);

                if (await _repository.SaveChangesAsync()) return Ok(existingCPFV);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }
            return BadRequest("Your request is invalid.");
        }
    }
}
