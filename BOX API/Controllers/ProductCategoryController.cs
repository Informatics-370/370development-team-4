using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpGet] //READ ALL FROM ENTITY
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
        [Route("GetCategory/{categoryId}")] //READ SPECIFIC CATEGORY AND ASSOCIATED SIZE VARIABLES
        public async Task<IActionResult> GetCategory(int categoryId)
        {
            try
            {
                var category = await _repository.GetCategoryAsync(categoryId);
                if (category == null) return NotFound("Product category does not exist on the system");

                var categorySizeVariable = await _repository.GetCategorySizeVariablesAsync(categoryId);
                if (categorySizeVariable == null) return NotFound("Product category does not exist on the system");

                var sizeVariable = await _repository.GetSizeVariableAsync(categorySizeVariable.SizeVariablesID);
                if (sizeVariable == null) return NotFound("Size variables do not exist on the system");

                CategoryViewModel catVM = new CategoryViewModel()
                {
                    CategoryDescription = category.Description,
                    Width = sizeVariable.Width,
                    Height = sizeVariable.Height,
                    Length = sizeVariable.Length,
                    Weight = sizeVariable.Weight,
                    Volume = sizeVariable.Volume
                };

                return Ok(catVM);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpPost] //ADD NEW CATEGORY WITH ITS SIZE VARIABLES
        [Route("AddCategory")]
        public async Task<IActionResult> AddCategory(CategoryViewModel catVM)
        {
            var category = new Product_Category { Description = catVM.CategoryDescription };
            var sizeVariable = new Size_Variables 
            {
                Width = catVM.Width, 
                Height = catVM.Height, 
                Length = catVM.Length,
                Weight = catVM.Weight,
                Volume = catVM.Volume
            };

            try
            {
                _repository.Add(category);
                _repository.Add(sizeVariable);
                var catSizeVar = new Category_Size_Variables 
                {    
                    CategoryID = category.CategoryID,
                    Product_Category = category,
                    SizeVariablesID = sizeVariable.SizeVariablesID,
                    Size_Variables = sizeVariable
                };
                _repository.Add(catSizeVar);
                await _repository.SaveChangesAsync();

                return Ok(catVM);
            }
            catch (Exception)
            { return BadRequest("Invalid transaction"); }

            
        }
    }
}
