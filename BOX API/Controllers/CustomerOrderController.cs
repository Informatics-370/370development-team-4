using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;


namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerOrderController : ControllerBase
    {
        private readonly IRepository _repository;

        public CustomerOrderController(IRepository repository)
        {
            _repository = repository;
        }

        //-------------------------------------------------- Get All Customer Orders --------------------------------------------------
        [HttpGet]
        [Route("GetAllCustomerOrders")]
        public async Task<IActionResult> GetAllCustomerOrders()
        {
            try
            {
                var cusOrders = await _repository.GetAllCustomerOrdersAsync();

                List<CustomerOrderViewModel> customerOrderViewModels = new List<CustomerOrderViewModel>(); //create array of VMs
                foreach (var order in cusOrders)
                {
                    var Status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID); //get status associated with this customer order

                    //get all customer order lines associated with this order and create array from them
                    List<CustomerOrderLineViewModel> orderLineList = new List<CustomerOrderLineViewModel>();
                    var orderLines = await _repository.GetOrderLinesByOrderAsync(order.CustomerOrderID);
                    if (orderLines == null) return NotFound("The customer order does not exist on the B.O.X System");

                    //put all order lines for this specific order in a list for the customer order VM and calculate total
                    decimal orderTotal = 0;
                    foreach (var ol in orderLines)
                    {
                        int fpID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value;
                        var fp = await _repository.GetFixedProductAsync(fpID);
                        orderTotal += fp.Price * ol.Quantity;

                        CustomerOrderLineViewModel colvm = new CustomerOrderLineViewModel
                        {
                            CustomerOrderLineID = ol.Customer_Order_LineID,
                            CustomerOrderID = ol.CustomerOrderID,
                            FixedProductID = fpID,
                            CustomerRefundID = ol.CustomerRefundID,
                            CustomProductID = 0,
                            Quantity = ol.Quantity
                        };
                        orderLineList.Add(colvm);
                    }

                    CustomerOrderViewModel eVM = new CustomerOrderViewModel()
                    {
                        CustomerOrderID = order.CustomerOrderID,
                        OrderStatusID = order.CustomerOrderStatusID,
                        UserId = orderLines[0].UserId,
                        OrderDeliveryScheduleID = order.OrderDeliveryScheduleID,
                        Date = order.Date,
                        DeliveryPhoto = Convert.ToBase64String(order.Delivery_Photo),
                        OrderStatusDescription = Status.Description,
                        orderTotalExcludingVAT = orderTotal,
                        CustomerOrders = orderLineList
                    };
                    customerOrderViewModels.Add(eVM);
                }


                return Ok(customerOrderViewModels);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services." + ex.Message + ' ' + ex.InnerException);
            }

        }


        //-------------------------------------------------- Get Order By ID ------------------------------------------------
        [HttpGet]
        [Route("GetOrder/{customerOrderId}")]
        public async Task<IActionResult> GetCustomerOrder(int customerOrderId)
        {
            try
            {
                var order = await _repository.GetCustomerOrderAsync(customerOrderId);
                if (order == null) return NotFound("The Customer Order does not exist on the B.O.X System");

                var orderLines = await _repository.GetOrderLinesByOrderAsync(order.CustomerOrderID); //get all order lines associated with this order
                if (orderLines == null) return NotFound("The Customer Order does not exist on the B.O.X System"); //an order must have at least 1 line

                //create list from estimate lines
                List<CustomerOrderLineViewModel> orderLineList = new List<CustomerOrderLineViewModel>();

                //put all estimate lines for this specific estimate in the list
                foreach (var ol in orderLines)
                {
                    int fpID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value;
                    //when I display a specific estimate, I also display the fixed product unit price and description
                    var fixedProduct = await _repository.GetFixedProductAsync(fpID);
                    var Status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID); //get status associated with this customer order

                    CustomerOrderLineViewModel elvm = new CustomerOrderLineViewModel()
                    {
                        CustomerOrderLineID = ol.Customer_Order_LineID,
                        CustomerOrderID = ol.CustomerOrderID,
                        FixedProductID = fpID,
                        FixedProductDescription = fixedProduct.Description,
                        FixedProductUnitPrice = fixedProduct.Price,
                        CustomProductID = 0,
                        Quantity = ol.Quantity,

                    };
                    orderLineList.Add(elvm);
                }

                var status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID); //get status associated with this customer order

                var CustomerOrderViewModel = new CustomerOrderViewModel
                {
                    CustomerOrderID = order.CustomerOrderID,
                    UserId = orderLines[0].UserId,
                    OrderStatusID = order.CustomerOrderStatusID,
                    OrderStatusDescription = status.Description,
                    OrderDeliveryScheduleID = order.OrderDeliveryScheduleID,
                    DeliveryPhoto = Convert.ToBase64String(order.Delivery_Photo),
                    Date = order.Date,
                    CustomerOrders = orderLineList
                };

                return Ok(CustomerOrderViewModel); //return order VM which contains order info plus order lines info in list format
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpGet]
        [Route("GetOrderByCustomer/{customerId}")]
        public async Task<IActionResult> GetOrderByCustomer(string customerId)
        {
            try
            {
                List<CustomerOrderViewModel> customerOrdere = new List<CustomerOrderViewModel>(); //create list to return
                var orderLines = await _repository.GetOrderLinesByCustomerAsync(customerId); //get all estimate lines for this customer

                List<CustomerOrderLineViewModel> allCustomerOrderLines = new List<CustomerOrderLineViewModel>();

                //put all the customer's order lines in VM
                foreach (var ol in orderLines)
                {
                    int fpID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value;
                    int cpID = ol.CustomProductID == null ? 0 : ol.CustomProductID.Value;
                    var fixedProduct = await _repository.GetFixedProductAsync(fpID);

                    CustomerOrderLineViewModel clVM = new CustomerOrderLineViewModel
                    {
                        CustomerOrderLineID = ol.Customer_Order_LineID,
                        CustomerOrderID = ol.CustomerOrderID,
                        FixedProductID = fpID,
                        FixedProductDescription = fixedProduct.Description,
                        FixedProductUnitPrice = fixedProduct.Price,
                        CustomProductID = cpID,
                        Quantity = ol.Quantity
                    };
                    allCustomerOrderLines.Add(clVM);
                }

                //Create estimate VMs for all the customer's estimates then group estimate lines into the estimate VMs
                var distinctOrderLines = orderLines.Select(el => el.CustomerOrderID).Distinct(); //returns all distinct estimate IDs
                int orderCount = distinctOrderLines.Count(); //count how many order there are

                foreach (var orderID in distinctOrderLines) //get all the estimates using the distinct estimateIDs and estimateVM
                {
                    Customer_Order order = await _repository.GetCustomerOrderAsync(orderID);
                    var status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID); //get status data

                    CustomerOrderViewModel eVM = new CustomerOrderViewModel
                    {
                        CustomerOrderID = order.CustomerOrderID,
                        OrderStatusID = order.CustomerOrderStatusID,
                        OrderStatusDescription = status.Description,
                        OrderDeliveryScheduleID = order.OrderDeliveryScheduleID,
                        DeliveryPhoto = Convert.ToBase64String(order.Delivery_Photo),
                        Date = order.Date,
                        UserId = customerId,
                        CustomerOrders = allCustomerOrderLines.Where(el => el.CustomerOrderID == orderID).ToList() //get all estimate lines for this estimate
                    };

                    customerOrdere.Add(eVM);
                }

                return Ok(customerOrdere);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        //-------------------------------------------------- Create Customer Order  ----------------------------------------------------
        [HttpPost]
        [Route("AddCustomerOrder")]
        public async Task<IActionResult> AddCustomerOrder([FromBody] CustomerOrderViewModel customerOrderViewModel)
        {
            // Create a new instance of Customer from the view model
            var order = new Customer_Order
            {
                //hard coded values are constant or can only ever be 1 in the DB. It'll be fine as long as we remember to change it on each person's machine and 1ce and for all on the final server
                CustomerOrderStatusID = 1, //estimate status of 'Pending review'. Statuses can't be CRUDed so this can be hard coded
                Delivery_Photo = Convert.FromBase64String(""),
                Date = customerOrderViewModel.Date

            }; //do not add value for estimateID manually else SQL won't auto generate it


            try
            {

                _repository.Add(order); // Save the order in the repository

                //get all estimate lines from the VM and put in estimate_line entity
                for (int i = 0; i < customerOrderViewModel.CustomerOrders.Count(); i++)
                {
                    var orderLineVM = customerOrderViewModel.CustomerOrders[i];

                    /*the estimate_line entity's ID is concatenated using customer ID, estimate ID and estimate line ID. An 
                    estimate with ID 5 by customer with ID 16, and 2 estimate lines will have 7 estimate_line records with IDs like so:
                        estimate ID: 5, customer ID: 16, and estimate line ID: 1
                        estimate ID: 5, customer ID: 16, and estimate line ID: 2
                    a new estimate by customer 16 with 3 estimate lines will be
                        estimate ID: 6, customer ID: 16, and estimate line ID: 1
                        estimate ID: 6, customer ID: 16, and estimate line ID: 2
                        estimate ID: 6, customer ID: 16, and estimate line ID: 3 */
                    Customer_Order_Line orderLineRecord = new Customer_Order_Line
                    {
                        Customer_Order_LineID = i + 1, //e.g. 1, then 2, 3, etc.
                        UserId = customerOrderViewModel.UserId,
                        CustomerOrderID = order.CustomerOrderID, //it's NB to save the estimate 1st so SQL generates its ID to use in the estimate line concatenated ID
                        Customer_Order = order,
                        CustomProductID = orderLineVM.CustomProductID == 0 ? null : orderLineVM.CustomProductID,
                        FixedProductID = orderLineVM.FixedProductID == 0 ? null : orderLineVM.FixedProductID,
                        Quantity = orderLineVM.Quantity
                    };

                    _repository.Add(orderLineRecord); //save estimate line in DB
                }

                // Save changes in the repository
                await _repository.SaveChangesAsync();

                return Ok(customerOrderViewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services. " + ex.Message + " has inner exception of " + ex.InnerException);
            }
        }

        [HttpPut]
        [Route("UpdateCustomerOrderStatus/{customerOrderId}/{customerOrderStatusId}")]
        public async Task<IActionResult> UpdateCustomerOrderStatus(int customerOrderId, int customerOrderStatusId)
        {
            try
            {

                var existingCustomerOrder = await _repository.GetCustomerOrderAsync(customerOrderId); //get order
                var existingCustomerOrderStatus = await _repository.GetCustomerOrderStatusAsync(customerOrderStatusId); //make sure the status exists

                if (existingCustomerOrder == null) return NotFound($"The estimate does not exist on the B.O.X System");
                if (existingCustomerOrderStatus == null) return NotFound($"The estimate status does not exist on the B.O.X System");

                existingCustomerOrder.CustomerOrderStatusID = customerOrderStatusId; //update status

                // Update the Customer Order in the repository
                await _repository.UpdateCustomerOrderAsync(existingCustomerOrder);

                return Ok(existingCustomerOrder);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }
    }
}
