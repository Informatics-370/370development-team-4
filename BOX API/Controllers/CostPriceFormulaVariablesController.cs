﻿using BOX.Models;
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
    }
}
