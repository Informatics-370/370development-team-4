﻿using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class WriteOffReasonController : ControllerBase
	{
		private readonly IRepository _repository;
		private readonly AppDbContext _dbContext;

		public WriteOffReasonController(IRepository repository, AppDbContext dbContext)
		{
			_repository = repository;
			_dbContext = dbContext;
		}

		[HttpGet]
		[Route("GetAllWriteOffReasons")]
		public async Task<IActionResult> GetAllWriteOffReasons()
		{
			try
			{
				var results = await _repository.GetAllWriteOffReasonsAsync();
				return Ok(results);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
			}
		}

		[HttpGet]
		[Route("GetWriteOffReason/{writeoffreasonId}")]
		public async Task<IActionResult> GetWriteOffReasonAsync(int writeoffreasonId)
		{
			try
			{
				var result = await _repository.GetWriteOffReasonAsync(writeoffreasonId);

				if (result == null) return NotFound("Size of product does not exist on system");

				return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support");
			}
		}

		[HttpPost]
		[Route("AddWriteOffReason")]
		public async Task<IActionResult> AddSize(WriteOffReasonViewModel worvm)
		{
			var writeoffreason = new Write_Off_Reason{ Description=worvm.Description };

			try
			{
				_repository.Add(writeoffreason);
				await _repository.SaveChangesAsync();
			}
			catch (Exception)
			{
				return BadRequest("Invalid transaction");
			}

			return Ok(writeoffreason);
		}

		[HttpPut]
		[Route("EditWriteOffReason/{writeoffreasonId}")]
		public async Task<ActionResult<WriteOffReasonViewModel>> EditSize(int writeoffreasonId, WriteOffReasonViewModel writeoffreasonmodel)
		{
			try
			{
				var existingwriteoffreason = await _repository.GetWriteOffReasonAsync(writeoffreasonId);
				if (existingwriteoffreason == null) return NotFound($"The Size does not exist on the BOX System");

				existingwriteoffreason.Description = writeoffreasonmodel.Description;

				if (await _repository.SaveChangesAsync())
				{
					return Ok(existingwriteoffreason);
				}
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support.");
			}
			return BadRequest("Your request is invalid.");
		}

		[HttpDelete]
		[Route("DeleteWriteOffReason/{writeoffreasonId}")]
		public async Task<IActionResult> DeleteWriteOffReason(int writeoffreasonId)
		{
			try
			{
				var existingWriteOffReason = await _repository.GetWriteOffReasonAsync(writeoffreasonId);

				if (existingWriteOffReason == null) return NotFound($"The Write Off Reason does not exist on the BOX System");

				_repository.Delete(existingWriteOffReason);

				if (await _repository.SaveChangesAsync()) return Ok(existingWriteOffReason);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support.");
			}
			return BadRequest("Your request is invalid.");
		}


        [HttpGet]
        [Route("GetWriteOffReport")]
        public async Task<IActionResult> GetWriteOffReport()
        {
            try
            {
                var writeOffItems = await _dbContext.Write_Off
                    .Include(w => w.Write_Off_Reason)
                    .Include(w => w.Stock_Take)
                    .Include(w => w.RawMaterial)
                    .Include(w => w.FixedProduct.Product_Item.Product_Category)
                    .ToListAsync();

                var writeOffViewModels = new List<WriteOffViewModel>();

                foreach (var writeOff in writeOffItems)
                {
                    var productItem = writeOff.RawMaterial != null ? writeOff.RawMaterial.Description : writeOff.FixedProduct.Description;
                    string category = null;

                    if (writeOff.RawMaterial == null)
                    {
                        category = writeOff.FixedProduct.Product_Item.Product_Category.Description;
                    }

                    var writeOffVM = new WriteOffViewModel
                    {
                        ProductItem = productItem,
                        Category = category,
                        QuantityOnHand = writeOff.Quantity,
                        LastWriteOffDate = writeOff.Stock_Take.Date
                    };

                    writeOffViewModels.Add(writeOffVM);
                }

                return Ok(writeOffViewModels);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error" + ex);
            }
        }






    }
}


