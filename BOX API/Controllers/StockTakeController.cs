using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
        [HttpPost]
        [Route("WriteOff")]
        public async Task<IActionResult> UpdateRawMaterial([FromBody] StockTakeViewModel stockTakeViewModel)
        {
            // Record the stock take with the user who updated it
            var stockTake = new Stock_Take
            {
                UserId = stockTakeViewModel.UserId,
                Date = DateTime.Now
            };

            _repository.Add(stockTake);
            await _repository.SaveChangesAsync();

            try
            {
                for (int i = 0; i < stockTakeViewModel.WriteOffs.Count(); i++)
                {
                    var writeOffVM = stockTakeViewModel.WriteOffs[i];
                    bool fixedProductWrittenOff = writeOffVM.FixedProductId > 0; //is true if fp was written off
                    Raw_Material rawMaterial = new Raw_Material();
                    Fixed_Product fixedProduct = new Fixed_Product();

                    if (fixedProductWrittenOff)
                    {
                        fixedProduct = await _repository.GetFixedProductAsync(writeOffVM.FixedProductId);
                    }
                    else
                    {
                        rawMaterial = await _repository.GetRawMaterialAsync(writeOffVM.RawMaterialId);
                    }

                    Write_Off writeOffRecord = new Write_Off
                    {
                        WriteOffReasonID = writeOffVM.WriteOffReasonID,
                        StockTakeID = stockTake.StockTakeID,
                        FixedProductId = writeOffVM.FixedProductId == 0 ? null : writeOffVM.FixedProductId,
                        RawMaterialId = writeOffVM.RawMaterialId == 0 ? null : writeOffVM.RawMaterialId,
                        //store quantity written off not updated quantity of products
                        Quantity = fixedProductWrittenOff ? fixedProduct.Quantity_On_Hand - writeOffVM.Quantity : rawMaterial.Quantity_On_Hand - writeOffVM.Quantity
                    };

                    _repository.Add(writeOffRecord);

                    // Update the quantity on hand of Raw_Material or Fixed_Product entities
                    if (writeOffVM.RawMaterialId != 0 && rawMaterial != null)
                    {
                        rawMaterial.Quantity_On_Hand = writeOffVM.Quantity;
                    }
                    else if (writeOffVM.FixedProductId != 0)
                    {
                        fixedProduct.Quantity_On_Hand = writeOffVM.Quantity;
                    }
                }

                // Save changes in the repository
                await _repository.SaveChangesAsync();

                return Ok(stockTakeViewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(400, "Bad Request" + ex.InnerException);
            }
        }

        //=============================== GET ALL STOCK TAKE =====================================
        [HttpGet]
        [Route("GetAllStockTake")]
        public async Task<IActionResult> GetAllStockTake()
        {
            try
            {
                var stockTakes = await _appDbContext.Stock_Take.Include(s => s.User).ToListAsync();

                // Map the User ID to the Username in each stock take
                foreach (var stockTake in stockTakes)
                {
                    stockTake.UserId = await GetUsernameById(stockTake.UserId);
                }

                return Ok(stockTakes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error" + ex);
            }
        }

        // Helper method to get the username by the user ID
        private async Task<string> GetUsernameById(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                return user.UserName;
            }
            return null;
        }
    }

}

