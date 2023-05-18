using BOX.Models;
using Microsoft.AspNetCore.Mvc;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ProductCategoryController : Controller
    {

        private readonly IRepository _repository;

        public ProductCategoryController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet] //READ FROM ENTITY
        [Route("GetAllCategories")]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var results = await _repository.GetAllCategoriesAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpGet]
        [Route("GetCategory/{categoryId}")]
        public async Task<IActionResult> GetCategory(int categoryId)
        {
            try
            {
                var result = await _repository.GetCategoryAsync(categoryId);

                if (result == null) return NotFound("Product category does not exist on the system");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }
    }
}
