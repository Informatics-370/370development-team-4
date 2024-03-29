﻿using BOX.Models;
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
    public class FixedProductController : ControllerBase
    {
        private readonly IRepository _repository;

        public FixedProductController(IRepository repository)
        {
            _repository = repository;
        }

        //-------------------------------------------------- Get All Fixed Products --------------------------------------------------
        [HttpGet]
        [Route("GetAllFixedProducts")]
        public async Task<IActionResult> GetAllFixedProducts()
        {
            try
            {
                var fixedProducts = await _repository.GetAllFixedProductsAsync();
                
                List<FixedProductViewModel> fixedProductViewModels = new List<FixedProductViewModel>();
                foreach (var fp in fixedProducts) 
                {
                    var qrCode = await _repository.GetQRCodeAsync(fp.QRCodeID); //get QR code byte array; GetAllFixedMaterialsAsync returns null for QR code
                    var price = await _repository.GetPriceByFixedProductAsync(fp.FixedProductID);

                    FixedProductViewModel fpVM = new FixedProductViewModel()
                    {
                        FixedProductID = fp.FixedProductID,
                        QRCodeID = fp.QRCodeID,
                        QRCodeBytesB64 = Convert.ToBase64String(qrCode.QR_Code_Photo),
                        ItemID = fp.ItemID,
                        SizeID = fp.SizeID,
                        Description = fp.Description,
                        ProductPhotoB64 = Convert.ToBase64String(fp.Product_Photo),
                        QuantityOnHand = fp.Quantity_On_Hand,
                        Price = price.Amount
                    };
                    fixedProductViewModels.Add(fpVM);
                }

                return Ok(fixedProductViewModels);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //-------------------------------------------------- Get Fixed Product By ID ------------------------------------------------
        [HttpGet]
        [Route("GetFixedProduct/{fixedProductId}")]
        public async Task<IActionResult> GetFixedProduct(int fixedProductId)
        {
            try
            {
                var fixedProduct = await _repository.GetFixedProductAsync(fixedProductId);

                if (fixedProduct == null) return NotFound("Fixed Product not found");

                var price = await _repository.GetPriceByFixedProductAsync(fixedProductId);
                if (price == null) return NotFound("Fixed Product not found"); //every fixed product should have a price otherwise, it don't exist

                var fixedProductViewModel = new FixedProductViewModel
                {
                    FixedProductID = fixedProduct.FixedProductID,
                    QRCodeID = fixedProduct.QRCodeID,
                    ItemID = fixedProduct.ItemID,
                    SizeID = fixedProduct.SizeID,
                    Description = fixedProduct.Description,
                    ProductPhotoB64 = Convert.ToBase64String(fixedProduct.Product_Photo),
                    QuantityOnHand = fixedProduct.Quantity_On_Hand,
                    Price = price.Amount
                };

                return Ok(fixedProductViewModel);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //-------------------------------------------------- Create Fixed Product ----------------------------------------------------
        [HttpPost]
        [Route("CreateFixedProduct")]
        public async Task<IActionResult> CreateFixedProduct([FromBody] FixedProductViewModel fixedProductViewModel)
        {
            try
            {
                // Create a new instance of Fixed_Product from the view model
                var fixedProduct = new Fixed_Product
                {
                    ItemID = fixedProductViewModel.ItemID,
                    SizeID = fixedProductViewModel.SizeID,
                    Description = fixedProductViewModel.Description,
                    Product_Photo = Convert.FromBase64String(fixedProductViewModel.ProductPhotoB64),
                    Quantity_On_Hand = 0
                };

                // Generate the QR code for the fixed product
                var qrCodeText = fixedProductViewModel.Description; // Use the description as the QR code data
                var qrCodeBytes = GenerateQRCode(qrCodeText);
                // Create a new QR_Code instance and assign the generated QR code bytes
                string b64string = qrCodeBytes.Remove(0, 22); //remove 'data:image/png;base64,' from string so I can call FromBase64String method

                var qrCode = new QR_Code
                {
                    //covert to byte array to prevent casting error
                    QR_Code_Photo = Convert.FromBase64String(b64string)
                };

                // Associate the QR code with the fixed product
                fixedProduct.QR_Code = qrCode;

                // Save the fixed product to the repository using the Add method
                _repository.Add(fixedProduct);

                // Save changes in the repository
                await _repository.SaveChangesAsync();

                //create new price record for fixed product
                Price price = new Price()
                {
                    FixedProductID = fixedProduct.FixedProductID,
                    Amount = fixedProductViewModel.Price,
                    Date = DateTime.Now
                };

                _repository.Add(price);
                // Save changes in the repository
                await _repository.SaveChangesAsync();

                // Return the created fixed product
                var createdFixedProductViewModel = new FixedProductViewModel
                {
                    FixedProductID = fixedProduct.FixedProductID,
                    QRCodeID = fixedProduct.QRCodeID,
                    ItemID = fixedProduct.ItemID,
                    SizeID = fixedProduct.SizeID,
                    Description = fixedProduct.Description,
                    Price = fixedProductViewModel.Price
                };

                return Ok(createdFixedProductViewModel);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //-------------------------------------------------- Update Fixed Product ----------------------------------------------------
        [HttpPut]
        [Route("UpdateFixedProduct/{fixedProductId}")]
        public async Task<IActionResult> UpdateFixedProduct(int fixedProductId, [FromBody] FixedProductViewModel fixedProductViewModel)
        {
            try
            {
                // Retrieve the existing fixed product from the database
                var existingFixedProduct = await _repository.GetFixedProductAsync(fixedProductViewModel.FixedProductID);

                if (existingFixedProduct == null)
                {
                    return NotFound("Fixed Product not found");
                }

                // Generate the QR code for the fixed product
                var qrCodeText = fixedProductViewModel.Description;
                var qrCodeBytes = GenerateQRCode(qrCodeText);
                //remove 'data:image/png;base64,' from string and convert to byte array to prevent casting error
                byte[] byteArr = Convert.FromBase64String(qrCodeBytes.Remove(0, 22));

                // Check if the existing fixed product has a QR_Code instance
                if (existingFixedProduct.QR_Code == null)
                {
                    //If it doesn't, create a new QR_Code instance and assign the generated QR code bytes
                    existingFixedProduct.QR_Code = new QR_Code
                    {
                        QR_Code_Photo = byteArr
                    };

                }
                else
                {
                    existingFixedProduct.QR_Code.QR_Code_Photo = byteArr;
                }

                // Update the other properties of the fixed product
                existingFixedProduct.ItemID = fixedProductViewModel.ItemID;
                existingFixedProduct.SizeID = fixedProductViewModel.SizeID;
                existingFixedProduct.Description = fixedProductViewModel.Description;
                existingFixedProduct.Product_Photo = Convert.FromBase64String(fixedProductViewModel.ProductPhotoB64);

                //create new price record for updated price
                Price price = new Price()
                {
                    FixedProductID = fixedProductId,
                    Amount = fixedProductViewModel.Price,
                    Date = DateTime.Now
                };

                // Update the fixed product in the repository
                await _repository.UpdateFixedProductAsync(existingFixedProduct);

                _repository.Add(price);
                // Save changes to price in the repository
                await _repository.SaveChangesAsync();

                // Return the updated fixed product
                var updatedFixedProductViewModel = new FixedProductViewModel
                {
                    FixedProductID = existingFixedProduct.FixedProductID,
                    QRCodeID = existingFixedProduct.QRCodeID,
                    ItemID = existingFixedProduct.ItemID,
                    SizeID = existingFixedProduct.SizeID,
                    Description = existingFixedProduct.Description,
                    Price = price.Amount
                };

                return Ok(updatedFixedProductViewModel);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //-------------------------------------------------- Update Fixed Product Quantity ----------------------------------------------------
        [HttpPut]
        [Route("EditFixedProductQuantity/{fixedProductId}/{fixedProductQuantityOnHand}")]
        //changed it from expecting viewmodel to string because the VM needed extra properties for the Get methods and that was causing issues
        public async Task<ActionResult<FixedProductViewModel>> EditFixedProductQuantity(int fixedProductId, int fixedProductQuantityOnHand)
        {
            try
            {
                var existingfixedProduct = await _repository.GetFixedProductAsync(fixedProductId);
                if (existingfixedProduct == null) return NotFound($"The Raw Material does not exist on the B.O.X System");

                //QR Code logic
                var qrCodeBytes = GenerateQRCode(existingfixedProduct.Description); //generate QR code
                                                                                   //remove 'data:image/png;base64,' from string and convert to byte array to prevent casting error
                byte[] byteArr = Convert.FromBase64String(qrCodeBytes.Remove(0, 22));

                // Check if the existing raw material has a QR_Code instance
                if (existingfixedProduct.QR_Code == null)
                {
                    //If it doesn't, create a new QR_Code instance and assign the generated QR code bytes
                    existingfixedProduct.QR_Code = new QR_Code
                    {
                        QR_Code_Photo = byteArr
                    };

                }
                else
                {
                    existingfixedProduct.QR_Code.QR_Code_Photo = byteArr;
                }

                existingfixedProduct.Quantity_On_Hand = fixedProductQuantityOnHand;


                if (await _repository.SaveChangesAsync())
                {
                    return Ok(existingfixedProduct);
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }
            return BadRequest("Your request is invalid.");
        }

        [HttpDelete]
        [Route("DeleteFixedProduct/{fixedProductId}")]
        public async Task<IActionResult> DeleteFixedProduct(int fixedProductId)
        {
            try
            {
                var existingFixedProduct = await _repository.GetFixedProductAsync(fixedProductId);

                if (existingFixedProduct == null) return NotFound($"The fixed product does not exist on the B.O.X System");

                _repository.Delete(existingFixedProduct);

                //delete associated QR code cos we aren't reusing it or retrieving historical data in any way
                var existingQRCode = await _repository.GetQRCodeAsync(existingFixedProduct.QRCodeID);
                _repository.Delete(existingQRCode);

                if (await _repository.SaveChangesAsync()) return Ok(existingFixedProduct);

            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact B.O.X support.");
            }
            return BadRequest("Your request is invalid.");
        }

        //Generating the QR Code
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
