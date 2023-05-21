using BOX.Models;
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
    }
}
