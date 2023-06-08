using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BOX.Models;
using BOX.ViewModel;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RawMaterialController : ControllerBase
    {
        private readonly IRepository _repository;

        public RawMaterialController(IRepository repository)
        {
            _repository = repository;
        }

        // GET: api/RawMaterial
        //READ ALL FROM ENTITY
        [HttpGet]
        [Route("GetAllRawMaterials")]
        public async Task<IActionResult> GetAllRawMaterials()
        {
          try
          {
                var results = await _repository.GetAllRawMaterialsAsync();
                return Ok(results);
          }
          catch (Exception)
          {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        // GET: api/RawMaterial/
        //GET SPECIFIC RAW MATERIAL
        [HttpGet("{id}")]
        public async Task<ActionResult<Raw_Material>> GetRawMaterial(int rawMaterialId)
        {
            try
            {
                var rawMaterial = await _repository.GetRawMaterialAsync(rawMaterialId);
                if (rawMaterial == null) return NotFound("Raw material does not exist on the system");

                RawMaterialViewModel rmVM = new RawMaterialViewModel()
                {
                    Description = rawMaterial.Description
                };

                return Ok(rmVM);
            }
            catch (Exception) 
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        // PUT: api/RawMaterial/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        [Route("UpdateRawMaterial/{rawMaterialId}")]
        public async Task<ActionResult<RawMaterialViewModel>> UpdateRawMaterial(int rawMaterialId, RawMaterialViewModel rmVM)
        {
            try
            {
                //Find the Raw Material
                var existingRawMaterial = await _repository.GetRawMaterialAsync(rawMaterialId);

                if (existingRawMaterial == null) 
                    return NotFound("The raw material does not exist on the B.O.X System");

                existingRawMaterial.Description = rmVM.Description;//Update Raw Material

                //Save Update
                if (await _repository.SaveChangesAsync())
                    return Ok(rmVM);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }

            return BadRequest("Your request is invalid.");
        }

        // POST: api/RawMaterial
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("AddRawMaterial")]
        public async Task<IActionResult> AddRawMaterial(RawMaterialViewModel rmVW)
        {
            var rawMaterial = new Raw_Material { Description = rmVW.Description };

            try 
            { 
  
                var createRM = new Raw_Material
                {
                    Description = rmVW.Description
                };
                _repository.Add(createRM);
                await _repository.SaveChangesAsync();

                return Ok(rmVW);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        // DELETE: api/RawMaterial/5
        //DELETE RAW MATERIAL
        [HttpDelete]
        [Route("DeleteRawMaterial/{rawMaterialId}")]
        public async Task<IActionResult> DeleteRawMaterial(int rawMaterialId)
        {
            try
            {
                //Find the raw material
                var existingRM = await _repository.GetRawMaterialAsync(rawMaterialId);
                if (existingRM == null)
                    return NotFound("The raw material does not exist on the B.O.X System");
                _repository.Delete(existingRM);//Delete

                if (await _repository.SaveChangesAsync())
                    return Ok(existingRM);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }

            return BadRequest("Your request is invalid.");
        }

    }
}
