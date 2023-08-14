using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System.Drawing;
using System.IO;


namespace BOX.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CustomProductController : ControllerBase
	{
		private readonly IRepository _repository;

		public CustomProductController(IRepository repository)
		{
			_repository = repository;
		}

		//-------------------------------------------------- Get All Custom Products --------------------------------------------------
		[HttpGet]
		[Route("GetAllCustomProducts")]
		public async Task<IActionResult> GetAllCustomProducts()
		{
			try
			{
				var customProducts = await _repository.GetAllCustomProductsAsync();

				List<CustomProductViewModel> customProductViewModels = new List<CustomProductViewModel>();
				foreach (var cp in customProducts)
				{
					var productItem = await _repository.GetItemAsync(cp.ItemID);

					CustomProductViewModel cpVM = new CustomProductViewModel()
					{
						CustomProductID = cp.CustomProductID,
						FormulaID = cp.FormulaID,
						ItemID = cp.ItemID,
						ItemDescription = productItem.Description,
						Width = cp.Width,
						Length = cp.Length,
						Height = cp.Height,
						Label = Convert.ToBase64String(cp.Label),
						Sides = cp.Sides
					};
					customProductViewModels.Add(cpVM);
				}

				return Ok(customProductViewModels);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		//-------------------------------------------------- Get Custom Product By ID ------------------------------------------------
		[HttpGet]
		[Route("GetCustomProduct/{customProductId}")]
		public async Task<IActionResult> GetCustomProduct(int customProductId)
		{
			try
			{
				var customProduct = await _repository.GetCustomProductAsync(customProductId);

				if (customProduct == null)
					return NotFound("Custom Product not found");

				var customProductViewModel = new CustomProductViewModel
				{
					CustomProductID = customProduct.CustomProductID,
					FormulaID = customProduct.FormulaID,
					ItemID = customProduct.ItemID,
					Width = customProduct.Width,
					Length = customProduct.Length,
					Height = customProduct.Height,
					Label = Convert.ToBase64String(customProduct.Label),
					Sides = customProduct.Sides
				};

				return Ok(customProductViewModel);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		//-------------------------------------------------- Create Custom Product ----------------------------------------------------
		[HttpPost]
		[Route("CreateCustomProduct")]
		public async Task<IActionResult> CreateCustomProduct([FromBody] CustomProductViewModel customProductViewModel)
		{
			try
			{
				// Create a new instance of Fixed_Product from the view model
				var customProduct = new Custom_Product
				{
					CustomProductID = 0,
					FormulaID = customProductViewModel.FormulaID,
					ItemID = customProductViewModel.ItemID,
					Width = customProductViewModel.Width,
					Length = customProductViewModel.Length,
					Height = customProductViewModel.Height,
					Label = Convert.FromBase64String(customProductViewModel.Label),
					Sides = customProductViewModel.Sides
				};


				// Save the custom product to the repository using the Add method
				_repository.Add(customProduct);

				// Save changes in the repository
				await _repository.SaveChangesAsync();

				// Return the created fixed product
				var createdCustomProductViewModel = new CustomProductViewModel
				{
					CustomProductID = customProduct.CustomProductID,
					FormulaID = customProduct.FormulaID,
					ItemID = customProduct.ItemID,
					Width = customProduct.Width,
					Length = customProduct.Length,
					Height = customProduct.Height,
					Sides = customProduct.Sides,
					Label = Convert.ToBase64String(customProduct.Label)
				};

				return Ok(createdCustomProductViewModel);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}


        [HttpDelete]
        [Route("DeleteCustomProduct/{customProductId}")]
        public async Task<IActionResult> DeleteCustomProduct(int customProductId)
        {
            try
            {
                var existingProduct = await _repository.GetCustomProductAsync(customProductId);

                if (existingProduct == null) return NotFound($"The custom product does not exist on the BOX System");

                _repository.Delete(existingProduct);

                if (await _repository.SaveChangesAsync()) return Ok(existingProduct);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
            return BadRequest("Your request is invalid.");
        }

    }
}
