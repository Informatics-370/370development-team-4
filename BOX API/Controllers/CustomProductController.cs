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
						Logo = Convert.ToBase64String(cp.Logo),
						Label = Convert.ToBase64String(cp.Label)
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
					Logo = Convert.ToBase64String(customProduct.Logo),
					Label = Convert.ToBase64String(customProduct.Label)
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
					Logo = Convert.FromBase64String(customProductViewModel.Logo),
					Label = Convert.FromBase64String(customProductViewModel.Label)
					//Product_Photo = Convert.FromBase64String(fixedProductViewModel.ProductPhotoB64),
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
					//Logo = Convert.ToBase64String(customProduct.Logo),
					//Label = Convert.ToBase64String(customProduct.Label)
				};

				return Ok(createdCustomProductViewModel);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}

		//-------------------------------------------------- Update Fixed Product ----------------------------------------------------
		[HttpPut]
		[Route("UpdateCustomProduct/{customProductId}")]
		public async Task<IActionResult> UpdateCustomProduct(int customProductId, [FromBody] CustomProductViewModel customProductViewModel)
		{
			try
			{
				// Retrieve the existing fixed product from the database
				var existingCustomProduct = await _repository.GetCustomProductAsync(customProductViewModel.CustomProductID);

				if (existingCustomProduct == null)
				{
					return NotFound("Custom Product not found");
				}


				// Update the other properties of the fixed product
				existingCustomProduct.CustomProductID = customProductViewModel.CustomProductID;
				existingCustomProduct.FormulaID = customProductViewModel.FormulaID;
				existingCustomProduct.ItemID = customProductViewModel.ItemID;
				existingCustomProduct.Width = customProductViewModel.Width;
				existingCustomProduct.Length = customProductViewModel.Length;
				existingCustomProduct.Height = customProductViewModel.Height;
				existingCustomProduct.Logo = Convert.FromBase64String(customProductViewModel.Logo);
				existingCustomProduct.Label = Convert.FromBase64String(customProductViewModel.Label);

				// Update the fixed product in the repository
				await _repository.UpdateCustomProductAsync(existingCustomProduct);

				// Return the updated custom product
				var updatedCustomProductViewModel = new CustomProductViewModel
				{
					CustomProductID = existingCustomProduct.CustomProductID,
					FormulaID = existingCustomProduct.FormulaID,
					ItemID = existingCustomProduct.ItemID,
					Width = existingCustomProduct.Width,
					Length = existingCustomProduct.Length,
					Height = existingCustomProduct.Height
					//Logo = Convert.ToBase64String(existingCustomProduct.Logo),
					//Label = Convert.ToBase64String(existingCustomProduct.Label)
				};

				return Ok(updatedCustomProductViewModel);
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
				var existingCustomProduct = await _repository.GetCustomProductAsync(customProductId);

				if (existingCustomProduct == null) return NotFound($"The Custom product does not exist on the B.O.X System");

				_repository.Delete(existingCustomProduct);


				if (await _repository.SaveChangesAsync()) return Ok(existingCustomProduct);

			}
			catch (Exception)
			{
				return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
			}
			return BadRequest("Your request is invalid.");
		}


	}


	
}
