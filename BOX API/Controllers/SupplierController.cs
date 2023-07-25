using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        private readonly IRepository _repository;

        public SupplierController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet] // READ ALL SUPPLIERS
        [Route("GetAllSuppliers")]
        public async Task<IActionResult> GetAllSuppliers()
        {
            try
            {
                var suppliers = await _repository.GetAllSuppliersAsync();
                return Ok(suppliers);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpGet]
        [Route("GetSupplier/{supplierId}")] // READ SPECIFIC SUPPLIER
        public async Task<IActionResult> GetSupplier(int supplierId)
        {
            try
            {
                var supplier = await _repository.GetSupplierAsync(supplierId);
                if (supplier == null)
                    return NotFound("Supplier does not exist in the system");

                return Ok(supplier);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

    [HttpPost]
    [Route("AddSupplier")]
    public async Task<IActionResult> AddSupplier(SupplierViewModel svm)
    {
      var supplier = new Supplier {Name=svm.Name, Address=svm.Address,Email=svm.Email,Contact_Number=svm.Phone_Number };

      try
      {
        _repository.Add(supplier);
        await _repository.SaveChangesAsync();
      }
      catch (Exception)
      {
        return BadRequest("Invalid transaction");
      }

      return Ok(supplier);
    }

    [HttpPut]
        [Route("UpdateSupplier/{supplierId}")]
        public async Task<IActionResult> UpdateSupplier(int supplierId, Supplier updatedSupplier)
        {
            try
            {
                var existingSupplier = await _repository.GetSupplierAsync(supplierId);
                if (existingSupplier == null)
        {
          return NotFound("Supplier does not exist in the system");
        }
                   

                existingSupplier.Name = updatedSupplier.Name;
                existingSupplier.Address = updatedSupplier.Address;
                existingSupplier.Contact_Number = updatedSupplier.Contact_Number;
                existingSupplier.Email = updatedSupplier.Email;

                await _repository.SaveChangesAsync();

                return Ok(existingSupplier);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpDelete]
        [Route("DeleteSupplier/{supplierId}")]
        public async Task<IActionResult> DeleteSupplier(int supplierId)
        {
            try
            {
                var existingSupplier = await _repository.GetSupplierAsync(supplierId);
                if (existingSupplier == null)
                    return NotFound("Supplier does not exist in the system");

                _repository.Delete(existingSupplier);
                await _repository.SaveChangesAsync();

                return Ok(existingSupplier);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }
    }
}
