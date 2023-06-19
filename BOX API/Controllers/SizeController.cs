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


    [HttpGet] //READ FROM ENTITY
    [Route("GetAllSizes")]
    public async Task<IActionResult> GetAllSizesAsync()
    {
      try
      {

        var results = await _repository.GetAllSizesAsync();

        List<SizeViewModel> sizeViewModels = new List<SizeViewModel>();
        foreach (var result in results)
        {
          var Category = await _repository.GetCategoryAsync(result.CategoryID);
          SizeViewModel svm = new SizeViewModel()
          {
            SizeID = result.SizeID,
            Width = result.Width,
            Height = result.Height,
            Weight = result.Weight,
            Length = result.Length,
            Volume = result.Volume,
            CategoryID = result.CategoryID,
            CategoryDescription = Category.Description,


          };
          sizeViewModels.Add(svm);

        }
        return Ok(sizeViewModels);
      }
      catch (Exception)
      { return StatusCode(500, "Internal Server Error. Please contact B.O.X support services."); }
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
    [Route("AddSizeUnit")]
    public async Task<IActionResult> AddSizeUnit(SizeViewModel svm)
    {
      var Size = new Size_Units {Volume=svm.Volume,Width=svm.Width,Height=svm.Height,Length=svm.Length,Weight=svm.Weight,CategoryID=svm.CategoryID};

      try
      {
        _repository.Add(Size);
        await _repository.SaveChangesAsync();
      }
      catch (Exception)
      {
        return BadRequest("Invalid transaction");
      }

      return Ok(Size);
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
        existingSize.CategoryID = sizeModel.CategoryID;

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


