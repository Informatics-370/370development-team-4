using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;


namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierOrderController : ControllerBase
    {
        private readonly IRepository _repository;

        public SupplierOrderController(IRepository repository)
        {
            _repository = repository;
        }

        //-------------------------------------------------- Get All Supplier Orders --------------------------------------------------
        [HttpGet]
        [Route("GetAllSupplierOrders")]
        public async Task<IActionResult> GetAllSupplierOrders()
        {
            try
            {
                var supOrders = await _repository.GetAllSupplierOrdersAsync();

                List<SupplierOrderViewModel> supplierOrderViewModels = new List<SupplierOrderViewModel>(); //create array of VMs
                foreach (var order in supOrders)
                {

                    //get all customer order lines associated with this order and create array from them
                    List<SupplierOrderLineViewModel> supplierOrderLineList = new List<SupplierOrderLineViewModel>();
                    var orderLines = await _repository.GetSupplierOrderLinesByOrderAsync(order.SupplierOrderID);

                    //put all customer order lines for this specific customer order in a list for the customer order VM
                    foreach (var ol in orderLines)
                    {

                        SupplierOrderLineViewModel solvm = new SupplierOrderLineViewModel
                        {
                            Supplier_OrderLineID = ol.Supplier_Order_LineID,
                            Fixed_ProductID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value,
                            Raw_MaterialID = ol.RawMaterialID == null ? 0 : ol.RawMaterialID.Value,
                            Supplier_ReturnID = ol.SupplierReturnID == null ? 0 : ol.SupplierReturnID.Value,
                            Quantity = ol.Quantity
                        };
                        supplierOrderLineList.Add(solvm);
                    }

                    SupplierOrderViewModel eVM = new SupplierOrderViewModel()
                    {
                        SupplierOrderID = order.SupplierOrderID,
                        SupplierID = order.SupplierID,
                        Date = order.Date.ToString(),
                        SupplierOrders = supplierOrderLineList
                    };
                    supplierOrderViewModels.Add(eVM);
                }

                return Ok(supplierOrderViewModels);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }

        }


        //-------------------------------------------------- Get Supplier Order By ID ------------------------------------------------
        [HttpGet]
        [Route("GetSupplierOrder/{supplierOrderId}")]
        public async Task<IActionResult> GetSupplierOrder(int supplierOrderId)
        {
            try
            {
                var order = await _repository.GetSupplierOrderAsync(supplierOrderId);
                if (order == null) return NotFound("The Supplier Order does not exist on the B.O.X System");

                var orderLines = await _repository.GetSupplierOrderLinesByOrderAsync(order.SupplierOrderID); //get all order lines associated with this order
                if (orderLines == null) return NotFound("The Supplier Order does not exist on the B.O.X System"); //an order must have at least 1 line

                //create list from order lines
                List<SupplierOrderLineViewModel> orderLineList = new List<SupplierOrderLineViewModel>();

                //put all order lines for this specific order in the list
                foreach (var ol in orderLines)
                {
                    Fixed_Product fixedProduct = new Fixed_Product();
                    Raw_Material rawMat = new Raw_Material();

                    if (ol.FixedProductID != null) //this orderline holds a fixed product
                    {
                        int fpID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value;
                        fixedProduct = await _repository.GetFixedProductAsync(fpID);
                    }
                    else //this orderline holds a raw material 
                    {
                        int rmID = ol.RawMaterialID == null ? 0 : ol.RawMaterialID.Value;
                        rawMat = await _repository.GetRawMaterialAsync(rmID);
                    }

                    SupplierOrderLineViewModel slvm = new SupplierOrderLineViewModel()
                    {
                        Supplier_OrderLineID = ol.Supplier_Order_LineID,
                        Supplier_ReturnID = ol.SupplierReturnID == null ? 0 : ol.SupplierReturnID.Value,
                        Fixed_ProductID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value,
                        FixedProduct_Description = fixedProduct.Description == null ? "" : fixedProduct.Description,
                        Raw_MaterialID = ol.RawMaterialID == null ? 0 : ol.RawMaterialID.Value,
                        Raw_Material_Description = rawMat.Description == null ? "" : rawMat.Description,
                        Quantity = ol.Quantity
                    };

                    orderLineList.Add(slvm);
                }

                var SupplierOrderViewModel = new SupplierOrderViewModel
                {
                    SupplierOrderID = order.SupplierOrderID,
                    Date = order.Date.ToString(),
                    SupplierID = order.SupplierID,
                    SupplierOrders = orderLineList
                };

                return Ok(SupplierOrderViewModel); //return supplier VM which contains supplier order info plus order lines info in list format
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpPost]
        [Route("AddSupplierOrder")]
        public async Task<IActionResult> AddSupplierOrder([FromBody] SupplierOrderViewModel supplierOrderViewModel)
        {
            // Start a database transaction; because of this, nothing is fully saved until the end so if there's an issue with 1 of the order lines, it doesn't save the order without order lines
            using var transaction = _repository.BeginTransaction();

            // Create a new instance of supplier order from the view model
            var order = new Supplier_Order
            {
                SupplierID = supplierOrderViewModel.SupplierID,
                Date = DateTime.Now
            };

            try
            {
                _repository.Add(order); // Save the order in the repository
                await _repository.SaveChangesAsync(); // Save changes in the repository

                //get all order lines from the VM and put in order line entity
                for (int i = 0; i < supplierOrderViewModel.SupplierOrders.Count(); i++)
                {
                    var orderLineVM = supplierOrderViewModel.SupplierOrders[i];

                    Supplier_OrderLine orderLineRecord = new Supplier_OrderLine
                    {
                        RawMaterialID = orderLineVM.Raw_MaterialID == 0 ? null : orderLineVM.Raw_MaterialID,
                        SupplierOrderID = order.SupplierOrderID, //it's NB to save the order 1st so SQL generates its ID
                        Supplier_Order = order,
                        FixedProductID = orderLineVM.Fixed_ProductID == 0 ? null : orderLineVM.Fixed_ProductID,
                        Quantity = orderLineVM.Quantity
                    };

                    //update fixed product / raw material quantity on hand
                    if (orderLineVM.Fixed_ProductID > 0)
                    {
                        var fp = await _repository.GetFixedProductAsync(orderLineVM.Fixed_ProductID);
                        fp.Quantity_On_Hand += orderLineVM.Quantity;
                    }
                    else
                    {
                        var rm = await _repository.GetRawMaterialAsync(orderLineVM.Raw_MaterialID);
                        rm.Quantity_On_Hand += orderLineVM.Quantity;
                    }

                    _repository.Add(orderLineRecord); //save order line in DB
                }

                // Save changes in the repository
                await _repository.SaveChangesAsync();
                transaction.Commit(); // Commit the transaction; everything is fully saved now

                return Ok(supplierOrderViewModel);
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services. " + ex.Message + " has inner exception of " + ex.InnerException);
            }
        }
    }
}
