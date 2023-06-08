using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System.Drawing;
using System.IO;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

	[Route("api/[controller]")]
	[ApiController]
	public class RawMaterialsController : ControllerBase
	{
		private readonly IRepository _repository;

		public RawMaterialsController(IRepository repository)
		{
			_repository = repository;
		}

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
				return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
			}
		}

		[HttpGet]
		[Route("GetRawMaterial/{rawmaterialId}")]
		public async Task<IActionResult> GetRawMaterialAsync(int rawmaterialId)
		{
			try
			{
				var result = await _repository.GetRawMaterialAsync(rawmaterialId);

				if (result == null) return NotFound("Raw material does not exist on system");

				return Ok(result);
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support");
			}
		}

		[HttpPost]
		[Route("AddRawMaterial")]
		public async Task<IActionResult> AddRawMaterial(RawMaterialViewModel rmvm)
		{
			var rawmaterial = new Raw_Material {Description=rmvm.Description};

			try
			{
				_repository.Add(rawmaterial);
				await _repository.SaveChangesAsync();
			}
			catch (Exception)
			{
				return BadRequest("Invalid transaction");
			}

			return Ok(rawmaterial);
		}

		[HttpPut]
		[Route("EditRawMaterial/{rawmaterialId}")]
		public async Task<ActionResult<RawMaterialViewModel>> EditRawMaterial(int rawmaterialId, RawMaterialViewModel rmvm)
		{
			try
			{
				var existingrawmaterial = await _repository.GetRawMaterialAsync(rawmaterialId);
				if (existingrawmaterial == null) return NotFound($"The Raw Material does not exist on the BOX System");


			
				existingrawmaterial.Description=rmvm.Description;

				if (await _repository.SaveChangesAsync())
				{
					return Ok(existingrawmaterial);
				}
			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact BOX support.");
			}
			return BadRequest("Your request is invalid.");
		}

		[HttpDelete]
		[Route("DeleteRawMaterial/{rawmaterialId}")]
		public async Task<IActionResult> DeleteRawMaterial(int rawmaterialId)
		{
			try
			{
				var existingrawmaterial = await _repository.GetRawMaterialAsync(rawmaterialId);

				if (existingrawmaterial == null) return NotFound($"The Raw Material does not exist on the BOX System");

				_repository.Delete(existingrawmaterial);

				if (await _repository.SaveChangesAsync()) return Ok(existingrawmaterial);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact support.");
			}
			return BadRequest("Your request is invalid.");
		}


	}
}


