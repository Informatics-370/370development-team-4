using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VatController : ControllerBase
    {
        private readonly IRepository _repository;

        public VatController(IRepository repository)
        {
            _repository = repository;
        }

        //READ ALL FROM ENTITY
        [HttpGet]
        [Route("GetAllVat")]
        public async Task<IActionResult> GetAllVat()
        {
            try
            {
                var results = await _repository.GetAllVatAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //GET SPECIFIC VAT
        [HttpGet("{id}")]
        public async Task<ActionResult<VAT>> GetVat(int vatId)
        {
            try
            {
                var vat = await _repository.GetVatAsync(vatId);
                if (vat == null) 
                    return NotFound("Raw mateorial does not exist on the system");

                VatViewModel vatVM = new VatViewModel()
                {
                    Percentage = vat.Percentage
                };

                return Ok(vatVM);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //UPDATE VAT
        [HttpPut]
        [Route("UpdateVAT/{vatId}")]
        public async Task<ActionResult<VatViewModel>> UpdateVat(int vatId, VatViewModel vatVM)
        {
            try
            {
                //Find the VAT
                var existingVat = await _repository.GetVatAsync(vatId);

                if (existingVat == null)
                    return NotFound("The VAT does not exist on the B.O.X System");

                existingVat.Percentage = vatVM.Percentage;//Update Vat Percentage
                vatVM.Date = DateTime.Now;
                existingVat.Date = vatVM.Date;//Update VAT Date

                //Save Update
                if (await _repository.SaveChangesAsync())
                    return Ok(vatVM);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }

            return BadRequest("Your request is invalid.");
        }

        //ADD VAT
        [HttpPost]
        [Route("AddVat")]
        public async Task<IActionResult> AddVat(VatViewModel vatVM)
        {
            var vat = new VAT { Percentage = vatVM.Percentage };

            try
            {
                _repository.Add(vat);
                var createVat = new VAT
                {
                    Percentage = vatVM.Percentage,
                    Date = vatVM.Date

                };
                _repository.Add(createVat);
                await _repository.SaveChangesAsync();

                return Ok(vatVM);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        //DELETE VAT
        [HttpDelete]
        [Route("DeleteVat/{vatId}")]
        public async Task<IActionResult> DeleteVat(int vatId)
        {
            try
            {
                //Find the raw material
                var existingVat = await _repository.GetVatAsync(vatId);
                if (existingVat == null)
                    return NotFound("The vat does not exist on the B.O.X System");
                _repository.Delete(existingVat);//Delete

                if (await _repository.SaveChangesAsync())
                    return Ok(existingVat);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }

            return BadRequest("Your request is invalid.");
        }
    }
}
