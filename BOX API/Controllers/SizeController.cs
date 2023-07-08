using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
//
namespace BOX.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class SizeController : ControllerBase
  {
    private readonly IRepository _repository;

    public SizeController(IRepository repository)
    {
      _repository = repository;
    }

    [HttpGet]
    [Route("GetAllSizes")]
    public async Task<IActionResult> GetAllSizes()
    {
      try
      {
        var results = await _repository.GetAllSizesAsync();
        return Ok(results);
      }
      catch (Exception)
      {
        return StatusCode(500, "Internal Server Error. Please contact BOX support services.");
      }
    }

    [HttpGet]
    [Route("GetSize/{sizeId}")]
    public async Task<IActionResult> GetSizeAsync(int sizeId)
    {
      try
      {
        var result = await _repository.GetSizeAsync(sizeId);

        if (result == null) return NotFound("Size of product does not exist on system");

        return Ok(result);
      }
      catch (Exception)
      {
        return StatusCode(500, "Internal Server Error. Please contact BOX support");
      }
    }

    [HttpPost]
    [Route("AddSize")]
    public async Task<IActionResult> AddSize(SizeViewModel svm)
    {
      var size = new Size_Units {
          Width = svm.Width,
          Height = svm.Height,
          Length = svm.Length,
          Weight = svm.Weight,
          Volume = svm.Volume,
          Description = svm.Description
      };

      try
      {
        _repository.Add(size);
        await _repository.SaveChangesAsync();
      }
      catch (Exception)
      {
        return BadRequest("Invalid transaction");
      }

      return Ok(size);
    }

    [HttpPut]
    [Route("EditSize/{sizeId}")]
    public async Task<ActionResult<SizeViewModel>> EditSize(int sizeId, SizeViewModel sizeModel)
    {
      try
      {
        var existingSize = await _repository.GetSizeAsync(sizeId);
        if (existingSize == null) return NotFound($"The Size does not exist on the BOX System");

     
        existingSize.Width = sizeModel.Width;
        existingSize.Height = sizeModel.Height;
        existingSize.Length= sizeModel.Length;
        existingSize.Weight = sizeModel.Weight;
        existingSize.Volume = sizeModel.Volume;
        existingSize.Description = sizeModel.Description;

        if (await _repository.SaveChangesAsync())
        {
          return Ok(existingSize);
        }
      }
      catch (Exception)
      {
        return StatusCode(500, "Internal Server Error. Please contact BOX support.");
      }
      return BadRequest("Your request is invalid.");
    }

    [HttpDelete]
    [Route("DeleteSize/{sizeId}")]
    public async Task<IActionResult> DeleteSize(int sizeId)
    {
      try
      {
        var existingSize = await _repository.GetSizeAsync(sizeId);

        if (existingSize == null) return NotFound($"The Size does not exist on the BOX System");

        _repository.Delete(existingSize);

        if (await _repository.SaveChangesAsync()) return Ok(existingSize);

      }
      catch (Exception)
      {
        return StatusCode(500, "Internal Server Error. Please contact support.");
      }
      return BadRequest("Your request is invalid.");
    }


  }
}


