using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ProductItemController : Controller
    {
        private readonly IRepository _repository;

        public ProductItemController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet] //READ FROM ENTITY
        [Route("GetAllItems")]
        public async Task<IActionResult> GetAllItems()
        {
            try
            {
                var results = await _repository.GetAllItemsAsync();
                return Ok(results);
            }
            catch (Exception)
            { return StatusCode(500, "Internal Server Error. Please contact B.O.X support services."); }
        }

        [HttpGet]
        [Route("GetItem/{itemId}")]
        public async Task<IActionResult> GetItem(int itemId)
        {
            try
            {
                var result = await _repository.GetItemAsync(itemId);

                if (result == null) return NotFound("Product item does not exist on the system");

                return Ok(result);
            }
            catch (Exception)
            { return StatusCode(500, "Internal Server Error. Please contact B.O.X support services."); }
        }

        [HttpPost]
        [Route("AddItem")]
        public async Task<IActionResult> AddItem(ItemViewModel itemVM)
        {
            var newItem = new Product_Item
            {
                Description = itemVM.ItemDescription,
                CategoryID = itemVM.CategoryId
            };

            try
            {
                _repository.Add(newItem);
                await _repository.SaveChangesAsync();
                return Ok(itemVM);
            }
            catch (Exception)
            { return BadRequest("Invalid transaction"); }

        }

        [HttpPut]
        [Route("UpdateItem/{itemId}")]
        public async Task<ActionResult<ItemViewModel>> UpdateItem(int itemId, ItemViewModel itemVM)
        {
            try
            {
                //find the item
                var existingItem = await _repository.GetItemAsync(itemId);
                if (existingItem == null) return NotFound("The product item does not exist on the B.O.X System");

                //update the item
                existingItem.Description = itemVM.ItemDescription;
                existingItem.CategoryID = itemVM.CategoryId; //I wanted to update the actual category object but it was throwing an error and I figured it wasn't necessary cos I have the ID anyways

                if (await _repository.SaveChangesAsync())
                    return Ok(itemVM);
            }
            catch (Exception)
            { return StatusCode(500, "Internal Server Error. Please contact B.O.X support."); }

            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteItem/{itemId}")]
        public async Task<IActionResult> DeleteItem(int itemId)
        {
            try
            {
                //find item
                var existingItem = await _repository.GetItemAsync(itemId);
                if (existingItem == null) return NotFound("The product item does not exist on the B.O.X System");

                //delete item
                _repository.Delete(existingItem);
                if (await _repository.SaveChangesAsync()) return Ok(existingItem);
            }
            catch (Exception)
            { return StatusCode(500, "Internal Server Error. Please contact B.O.X support."); }

            return BadRequest("Your request is invalid.");
        }

    }
}
