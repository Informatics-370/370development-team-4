using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IRepository _repository;

        public ReportsController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetSalesByCategoryReport/{stringStartDate}/{stringEndDate}")]
        public async Task<IActionResult> GetSalesByCategoryReport(string stringStartDate, string stringEndDate)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(stringStartDate) || string.IsNullOrWhiteSpace(stringEndDate))
                {
                    return BadRequest("Invalid date range");
                }

                //convert dates from string to datetime
                if (DateTime.TryParseExact(stringStartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime startDate) &&
                    DateTime.TryParseExact(stringEndDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime endDate))
                {                    
                    var ordersInRange = await _repository.GetOrdersWithinRangeAsync(startDate, endDate);
                    // Dictionary to hold grouped products by product item
                    // dictionary = key, value pairs. Keys are disctinct. This dictionary will have key value pairs with
                    // the keys being  of type product item and the value being of type decimal cos that's the total sales per product item
                    var salesByProdItem = new Dictionary<Product_Item, decimal>();

                    //get fixed and custom products on each order
                    foreach (var order in ordersInRange)
                    {
                        var orderLines = await _repository.GetOrderLinesByOrderAsync(order.CustomerOrderID);

                        foreach (var line in orderLines)
                        {
                            //get product that was ordered
                            bool fpOrdered = line.FixedProductID != null; //is true if fixed prod was orderd
                            Fixed_Product fp;
                            Custom_Product cp;
                            Product_Item item;

                            if (fpOrdered) //a fixed prod was ordered
                            {
                                fp = await _repository.GetFixedProductAsync(line.FixedProductID.Value); //get fixed prod
                                item = await _repository.GetItemAsync(fp.ItemID); //get fixed prod's product item
                            }
                            else
                            {
                                cp = await _repository.GetCustomProductAsync(line.CustomProductID.Value); //get custom product
                                item = await _repository.GetItemAsync(cp.ItemID); //get custom product's product item
                            }

                            //if the product item we're dealing with isn't already in our dictionary, create a new key value pair
                            //in dictionary to hold new prod item and its total sales. Initialise total sales to 0
                            if (!salesByProdItem.ContainsKey(item))
                            {
                                salesByProdItem[item] = 0;
                            }

                            salesByProdItem[item] += line.Quantity * line.Confirmed_Unit_Price; //add sales of this line to product item total sales
                        }
                    }

                    // put data from sales by item dictionary in VM
                    var salesByCatReportVMs = new List<SalesByCategoryVM>();

                    foreach (var itemSales in salesByProdItem)
                    {
                        var item = itemSales.Key; //get product item from dictionary
                        var category = await _repository.GetCategoryAsync(item.CategoryID); //get category for subtotals

                        var salesByCatVM = new SalesByCategoryVM
                        {
                            ItemID = item.ItemID,
                            ItemDescription = item.Description,
                            CategoryID = category.CategoryID,
                            CategoryDescription = category.Description,
                            Sales = itemSales.Value //get total sales from dictionary
                        };

                        salesByCatReportVMs.Add(salesByCatVM);
                    }

                    return Ok(salesByCatReportVMs);
                }

                return BadRequest("Your request is invalid");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services." + ex.Message + " inner exception " +  ex.InnerException);
            }
        }

        [HttpGet]
        [Route("GetInactiveCustomerList")]
        public async Task<IActionResult> GetInactiveCustomerList()
        {
            try
            {
                //a customer is inactive if they haven't ordered in 90 days
                DateTime now = DateTime.Now;
                int daysToSubtract = 90;
                //int minutesToSubtract = 15;

                DateTime ninetyDaysAgo = now.AddDays(-daysToSubtract);
                //DateTime fifteenMinutesAgo = now.AddMinutes(-minutesToSubtract);

                var allCustomers = await _repository.GetAllCustomersAsync();
                List<UserViewModel> inactiveCustomers  = new List<UserViewModel>();

                foreach (var cus in allCustomers)
                {
                    var customerOrdersWithinRange = await _repository.GetCustomerOrdersWithinRange(cus.UserId, ninetyDaysAgo, now);
                    //var customerOrdersWithinRange = await _repository.GetCustomerOrdersWithinRange(cus.UserId, fifteenMinutesAgo, now);

                    if (!(customerOrdersWithinRange.Count() > 0))
                    {
                        var user = await _repository.GetUserAsync(cus.UserId);
                        string fullname = await _repository.GetUserFullNameAsync(cus.UserId);

                        UserViewModel userVM = new UserViewModel
                        {
                            emailaddress = user.Email,
                            firstName = fullname
                        };
                        
                        inactiveCustomers.Add(userVM);
                    }
                }

                return Ok(inactiveCustomers);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services." + ex.Message + " inner exception " + ex.InnerException);
            }


        }
    }
}
