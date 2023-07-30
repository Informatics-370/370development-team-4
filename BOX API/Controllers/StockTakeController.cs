using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using System.Drawing;
using ZXing;
using ZXing.Common;
using ZXing.QrCode;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BOX.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class StockTakeController : ControllerBase
  {
        private readonly AppDbContext _appDbContext;
        private readonly IRepository _repository;
        private readonly UserManager<User> _userManager;

        public StockTakeController(AppDbContext appDbContext, IRepository repository, UserManager<User> userManager)
        {
            _appDbContext = appDbContext;
            _repository = repository;
            _userManager = userManager;
        }

        //=============================== PERFORM STOCK TAKE =====================================
        
        //Increase the raw materials
        [HttpPut]
        [Route("UpdateRawMaterial/{rawMaterialId}")]
        public async Task<IActionResult> UpdateRawMaterial(int rawMaterialId, string userId, UpdateRawMaterialDTO updatedRawMaterial)
        {
            try
            {
                var existingRawMaterial = await _repository.GetRawMaterialAsync(rawMaterialId);

                if (existingRawMaterial == null)
                {
                    return NotFound();
                }

                // Quantity can only be increased
                if (updatedRawMaterial.quantity <= 0)
                {
                    return BadRequest("Quantity must be a positive number.");
                }

                // Update the properties of the existing raw material with the data from the view model
                existingRawMaterial.Quantity_On_Hand = updatedRawMaterial.quantity;

                // Save changes to the database
                await _repository.SaveChangesAsync();

                // Record the stock take with the user who updated it
                var stockTake = new Stock_Take
                {
                    UserId = userId,
                    Date = DateTime.Now.ToString() // Or use DateTimeOffset.UtcNow.ToString() for better timezone handling
                };

                _repository.Add(stockTake);

                await _repository.SaveChangesAsync();

                return Ok(existingRawMaterial);
            }
            catch (Exception)
            {
                return StatusCode(400, "Bad Request");
            }
        }

        //Increase the fixed product
        [HttpPut]
        [Route("UpdateFixedProduct/{fixedProductId}")]
        public async Task<IActionResult> UpdateFixedProduct(int fixedProductId, string userId, UpdateFixedProduct updatedFixedProduct)
        {
            try
            {
                var exisitingProduct = await _repository.GetFixedProductAsync(fixedProductId);

                if (exisitingProduct == null)
                {
                    return NotFound();
                }

                // Quantity can only be increased
                if (updatedFixedProduct.quantity <= 0)
                {
                    return BadRequest("Quantity must be a positive number.");
                }

                // Update the properties of the existing raw material with the data from the view model
                exisitingProduct.Quantity_On_Hand = updatedFixedProduct.quantity;

                // Save changes to the database
                await _repository.SaveChangesAsync();

                // Record the stock take with the user who updated it
                var stockTake = new Stock_Take
                {
                    UserId = userId,
                    Date = DateTime.Now.ToString() // Or use DateTimeOffset.UtcNow.ToString() for better timezone handling
                };

                _repository.Add(stockTake);

                await _repository.SaveChangesAsync();

                return Ok(exisitingProduct);
            }
            catch (Exception)
            {
                return StatusCode(400, "Bad Request");
            }
        }

        //=============================== PERFORM WRITE OFF =====================================

        //Decrease the raw materials
        [HttpPut]
        [Route("WriteOffRawMaterial/{rawMaterialId}")]
        public async Task<IActionResult> WriteOffRawMaterial(int rawMaterialId, string userId, UpdateRawMaterialDTO updatedRawMaterial)
        {
            try
            {
                var existingRawMaterial = await _repository.GetRawMaterialAsync(rawMaterialId);

                if (existingRawMaterial == null)
                {
                    return NotFound();
                }

                
                if (updatedRawMaterial.quantity <= 0)
                {
                    return BadRequest("Quantity must be a positive number.");
                }

                // Check if the new quantity is greater than the current quantity on hand
                if (updatedRawMaterial.quantity > existingRawMaterial.Quantity_On_Hand)
                {
                    return BadRequest("Quantity to write off cannot exceed the current quantity on hand.");
                }

                // Update the properties of the existing raw material with the data from the view model
                existingRawMaterial.Quantity_On_Hand -= updatedRawMaterial.quantity;

                // Save changes to the database
                await _repository.SaveChangesAsync();

                // Record the stock take with the user who updated it
                var stockTake = new Stock_Take
                {
                    UserId = userId,
                    Date = DateTime.Now.ToString() // Or use DateTimeOffset.UtcNow.ToString() for better timezone handling
                };

                _repository.Add(stockTake);

                await _repository.SaveChangesAsync();

                return Ok(existingRawMaterial);
            }
            catch (Exception)
            {
                return StatusCode(400, "Bad Request");
            }
        }

        //Decrease the fixed products
        [HttpPut]
        [Route("WriteOffFixedProduct/{fixedProductId}")]
        public async Task<IActionResult> WriteOffFixedProduct(int fixedProductId, string userId, UpdateFixedProduct updatedFixedProduct)
        {
            try
            {
                var existingProduct = await _repository.GetFixedProductAsync(fixedProductId);

                if (existingProduct == null)
                {
                    return NotFound();
                }

                // Quantity can only be decreased
                if (updatedFixedProduct.quantity <= 0)
                {
                    return BadRequest("Quantity must be a positive number.");
                }

                // Check if the new quantity is greater than the current quantity on hand
                if (updatedFixedProduct.quantity > existingProduct.Quantity_On_Hand)
                {
                    return BadRequest("Quantity to write off cannot exceed the current quantity on hand.");
                }

                // Update the properties of the existing fixed product with the data from the view model
                existingProduct.Quantity_On_Hand -= updatedFixedProduct.quantity;

                // Save changes to the database
                await _repository.SaveChangesAsync();

                // Record the stock take with the user who updated it
                var stockTake = new Stock_Take
                {
                    UserId = userId,
                    Date = DateTime.Now.ToString() // Or use DateTimeOffset.UtcNow.ToString() for better timezone handling
                };

                _repository.Add(stockTake);

                await _repository.SaveChangesAsync();

                return Ok(existingProduct);
            }
            catch (Exception)
            {
                return StatusCode(400, "Bad Request");
            }
        }

        private string GenerateQRCode(string data)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
            QRCode qrCode = new QRCode(qrCodeData);
            Bitmap qrCodeImage = qrCode.GetGraphic(20);

            using (MemoryStream stream = new MemoryStream())
            {
                qrCodeImage.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                byte[] imageBytes = stream.ToArray();
                string base64Image = Convert.ToBase64String(imageBytes);
                return $"data:image/png;base64,{base64Image}";
            }
        }        

    }
}
