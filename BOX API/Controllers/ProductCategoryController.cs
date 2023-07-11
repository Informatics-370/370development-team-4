    using BOX.Models;
    using BOX.ViewModel;
    using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.VisualBasic.Syntax;
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
                    List<CategoryViewModel> categoryVMs = new List<CategoryViewModel>();
                    foreach (var cat in results)
                    {
                        //get size variables
                        var categorySizeVariable = await _repository.GetCategorySizeVariablesAsync(cat.CategoryID);
                        if (categorySizeVariable == null) return NotFound("Product category does not exist on the system");

                        var sizeVariable = await _repository.GetSizeVariableAsync(categorySizeVariable.SizeVariablesID);
                        if (sizeVariable == null) { return NotFound("Size variables do not exist on the system"); }
                        else
                        {
                            CategoryViewModel catVM = new CategoryViewModel()
                            {
                                categoryID = cat.CategoryID,
                                categoryDescription = cat.Description,
                                width = sizeVariable.Width,
                                height = sizeVariable.Height,
                                weight = sizeVariable.Weight,
                                length = sizeVariable.Length,
                                volume = sizeVariable.Volume
                            };

                            categoryVMs.Add(catVM);
                        }
                    }

                    return Ok(categoryVMs);
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
                    if (sizeVariable == null) { return NotFound("Size variables do not exist on the system"); }

                    CategoryViewModel catVM = new CategoryViewModel()
                    {
                        categoryID = categoryId,
                        categoryDescription = category.Description,
                        width = sizeVariable.Width,
                        height = sizeVariable.Height,
                        length = sizeVariable.Length,
                        weight = sizeVariable.Weight,
                        volume = sizeVariable.Volume
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
                var category = new Product_Category { Description = catVM.categoryDescription };
                var sizeVariable = new Size_Variables 
                {
                    Width = catVM.width, 
                    Height = catVM.height, 
                    Length = catVM.length,
                    Weight = catVM.weight,
                    Volume = catVM.volume

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

            [HttpPut]
            [Route("UpdateCategory/{categoryId}")]
            public async Task<ActionResult<CategoryViewModel>> UpdateCategory(int categoryId, CategoryViewModel categoryVM)
            {
                try
                {
                    //find the category
                    var existingCategory = await _repository.GetCategoryAsync(categoryId);
                    if (existingCategory == null) return NotFound("The category does not exist on the B.O.X System");

                    //find the category_size_variable
                    var existingCatSizeVar = await _repository.GetCategorySizeVariablesAsync(categoryId);
                    if (existingCatSizeVar == null) return NotFound("The category does not exist on the B.O.X System");

                    //use that to find the size variable
                    var existingSizeVar = await _repository.GetSizeVariableAsync(existingCatSizeVar.SizeVariablesID);
                    if (existingSizeVar == null) return NotFound("The size variable does not exist on the B.O.X System");
                                
                    existingCategory.Description = categoryVM.categoryDescription; //update the category
                    //update the size variables
                    existingSizeVar.Width = categoryVM.width;
                    existingSizeVar.Length = categoryVM.length;
                    existingSizeVar.Height = categoryVM.height;
                    existingSizeVar.Weight = categoryVM.weight;
                    existingSizeVar.Volume = categoryVM.volume;

                    if (await _repository.SaveChangesAsync())
                        return Ok(categoryVM);
                }
                catch (Exception)
                { return StatusCode(500, "Internal Server Error. Please contact B.O.X support."); }

                return BadRequest("Your request is invalid.");
            }

            [HttpDelete]
            [Route("DeleteCategory/{categoryId}")]
            public async Task<IActionResult> DeleteCategory(int categoryId)
            {
                try
                {
                    //find the category
                    var existingCategory = await _repository.GetCategoryAsync(categoryId);
                    if (existingCategory == null) return NotFound("The category does not exist on the B.O.X System");

                    //find the category_size_variable
                    var existingCatSizeVar = await _repository.GetCategorySizeVariablesAsync(categoryId);
                    if (existingCatSizeVar == null) return NotFound("The category does not exist on the B.O.X System");

                    //use that to find the size variable
                    var existingSizeVar = await _repository.GetSizeVariableAsync(existingCatSizeVar.SizeVariablesID);
                    if (existingSizeVar == null) return NotFound("The size variable does not exist on the B.O.X System");

                    //delete category, size variable and category_size_variable record in associative entity
                    _repository.Delete(existingCategory);
                    _repository.Delete(existingSizeVar);
                    _repository.Delete(existingCatSizeVar);

                    if (await _repository.SaveChangesAsync()) return Ok(existingCatSizeVar);

                }
                catch (Exception)
                { return StatusCode(500, "Internal Server Error. Please contact B.O.X support."); }

                return BadRequest("Your request is invalid.");
            }

        }
    }
