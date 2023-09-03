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
                    //get all customer order lines associated with this order and create array from them
                    List<CustomerOrderLineViewModel> orderLineList = new List<CustomerOrderLineViewModel>();
                    var orderLines = await _repository.GetOrderLinesByOrderAsync(order.CustomerOrderID);

                    //put all order lines for this specific order in a list for the customer order VM
                    foreach (var ol in orderLines)
                    {
                        CustomerOrderLineViewModel colvm = new CustomerOrderLineViewModel
                        {
                            CustomerOrderLineID = ol.CustomerOrderLineID,
                            FixedProductID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value,
                            CustomProductID = ol.CustomProductID == null ? 0 : ol.CustomProductID.Value,
                            ConfirmedUnitPrice = ol.Confirmed_Unit_Price,
                            Quantity = ol.Quantity,
                            CustomerReturnID = ol.CustomerReturnID == null ? 0 : ol.CustomerReturnID.Value
                        };
                        orderLineList.Add(colvm);
                    }

                    var Status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID); //get status associated with this customer order
                    string fullName = await _repository.GetUserFullNameAsync(order.UserId);

                    var deliverySchedule = new Order_Delivery_Schedule();

                    if (order.OrderDeliveryScheduleID != null)
                    {
                        int deliveryScheduleID = order.OrderDeliveryScheduleID.Value;
                        deliverySchedule = await _repository.GetCustomerOrderDeliveryScheduleAsync(deliveryScheduleID);
                    }

                    CustomerOrderViewModel coVM = new CustomerOrderViewModel()
                    {
                        CustomerOrderID = order.CustomerOrderID,
                        QuoteID = order.QuoteID,
                        OrderStatusID = order.CustomerOrderStatusID,
                        OrderStatusDescription = Status.Description,
                        CustomerId = order.UserId,
                        CustomerFullName = fullName,
                        DeliveryScheduleID = deliverySchedule.OrderDeliveryScheduleID,
                        DeliveryDate = (DateTime)order.Delivery_Date,
                        Date = order.Date,
                        DeliveryType = order.Delivery_Type,
                        DeliveryPhoto = Convert.ToBase64String(order.Delivery_Photo),
                        OrderLines = orderLineList
                    };
                    customerOrderViewModels.Add(coVM);
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

                //create list from order lines
                List<CustomerOrderLineViewModel> orderLineList = new List<CustomerOrderLineViewModel>();

                //put all estimate lines for this specific estimate in the list
                foreach (var ol in orderLines)
                {
                    Fixed_Product fixedProduct = new Fixed_Product();
                    string customProdDescription = "Custom product ";

                    if (ol.CustomProductID != null) //this orderline holds a custom product
                    {
                        int cpID = ol.CustomProductID.Value;
                        Custom_Product customProduct = await _repository.GetCustomProductAsync(cpID);

                        //concatenate custom product string
                        customProdDescription += customProduct.Length + "mm x " + customProduct.Width + "mm x " + customProduct.Height + "mm";
                    }
                    else
                    {
                        int fpID = ol.FixedProductID.Value;
                        fixedProduct = await _repository.GetFixedProductAsync(fpID);
                    }

                    CustomerOrderLineViewModel olvm = new CustomerOrderLineViewModel()
                    {
                        CustomerOrderLineID = ol.CustomerOrderLineID,
                        FixedProductID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value,
                        FixedProductDescription = fixedProduct.Description,
                        CustomProductID = ol.CustomProductID == null ? 0 : ol.CustomProductID.Value,
                        CustomProductDescription = customProdDescription,
                        Quantity = ol.Quantity,
                        ConfirmedUnitPrice = ol.Confirmed_Unit_Price,
                        CustomerReturnID = ol.CustomerReturnID == null ? 0 : ol.CustomerReturnID.Value
                    };
                    orderLineList.Add(olvm);
                }

                var status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID); //get status associated with this customer order
                string fullName = await _repository.GetUserFullNameAsync(order.UserId);

                //get delivery schedule date
                var deliverySchedule = new Order_Delivery_Schedule();

                if (order.OrderDeliveryScheduleID != null)
                {
                    int deliveryScheduleID = order.OrderDeliveryScheduleID.Value;
                    deliverySchedule = await _repository.GetCustomerOrderDeliveryScheduleAsync(deliveryScheduleID);
                }

                var CustomerOrderViewModel = new CustomerOrderViewModel
                {
                    CustomerOrderID = order.CustomerOrderID,
                    QuoteID = order.QuoteID,
                    OrderStatusID = order.CustomerOrderStatusID,
                    OrderStatusDescription = status.Description,
                    CustomerId = order.UserId,
                    CustomerFullName = fullName,
                    DeliveryScheduleID = deliverySchedule.OrderDeliveryScheduleID,
                    DeliveryDate = (DateTime)order.Delivery_Date,
                    DeliveryType = order.Delivery_Type,
                    DeliveryPhoto = Convert.ToBase64String(order.Delivery_Photo),
                    Date = order.Date,
                    OrderLines = orderLineList
                };

                return Ok(CustomerOrderViewModel); //return order VM which contains order info plus order lines info in list format
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpGet]
        [Route("GetOrdersByCustomer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomer(string customerId)
        {
            try
            {
                List<CustomerOrderViewModel> customerOrderVMs = new List<CustomerOrderViewModel>(); //create list to return
                var orders = await _repository.GetOrdersByCustomerAsync(customerId); //get all orders for this customer

                foreach (var order in orders)
                {
                    //get all order lines associated with this order and create array from them
                    List<CustomerOrderLineViewModel> olList = new List<CustomerOrderLineViewModel>();

                    var orderLines = await _repository.GetOrderLinesByOrderAsync(order.CustomerOrderID);
                    if (orderLines == null) return NotFound("The order does not exist on the B.O.X System"); //an order must have at least 1 line

                    //put all order lines for this specific order in a list for the order VM
                    foreach (var ol in orderLines)
                    {
                        Fixed_Product fixedProduct = new Fixed_Product();
                        string customProdDescription = "Custom product ";

                        if (ol.CustomProductID != null) //this orderline holds a custom product
                        {
                            int cpID = ol.CustomProductID.Value;
                            Custom_Product customProduct = await _repository.GetCustomProductAsync(cpID);

                            //concatenate custom product string
                            customProdDescription += customProduct.Length + "mm x " + customProduct.Width + "mm x " + customProduct.Height + "mm";
                        }
                        else
                        {
                            int fpID = ol.FixedProductID.Value;
                            fixedProduct = await _repository.GetFixedProductAsync(fpID);
                        }

                        CustomerOrderLineViewModel olVM = new CustomerOrderLineViewModel
                        {
                            CustomerOrderLineID = ol.CustomerOrderLineID,
                            FixedProductID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value,
                            FixedProductDescription = fixedProduct.Description,
                            CustomProductID = ol.CustomProductID == null ? 0 : ol.CustomProductID.Value,
                            CustomProductDescription = customProdDescription,
                            ConfirmedUnitPrice = ol.Confirmed_Unit_Price,
                            Quantity = ol.Quantity,
                            CustomerReturnID = ol.CustomerReturnID == null ? 0 : ol.CustomerReturnID.Value
                        };
                        olList.Add(olVM);
                    }

                    string fullName = await _repository.GetUserFullNameAsync(order.UserId);
                    var status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID);
                    var rejectReason = new Reject_Reason();

                    //get delivery schedule date
                    var deliverySchedule = new Order_Delivery_Schedule();

                    if (order.OrderDeliveryScheduleID != null)
                    {
                        int deliveryScheduleID = order.OrderDeliveryScheduleID.Value;
                        deliverySchedule = await _repository.GetCustomerOrderDeliveryScheduleAsync(deliveryScheduleID);
                    }

                    CustomerOrderViewModel orVM = new CustomerOrderViewModel
                    {
                        CustomerOrderID = order.CustomerOrderID,
                        QuoteID = order.QuoteID,
                        OrderStatusID = order.CustomerOrderStatusID,
                        OrderStatusDescription = status.Description,
                        CustomerId = order.UserId,
                        CustomerFullName = fullName,
                        DeliveryScheduleID = deliverySchedule.OrderDeliveryScheduleID,
                        DeliveryDate = (DateTime)order.Delivery_Date,
                        Date = order.Date,
                        DeliveryType = order.Delivery_Type,
                        DeliveryPhoto = Convert.ToBase64String(order.Delivery_Photo),
                        OrderLines = olList
                    };
                    customerOrderVMs.Add(orVM);
                }

                return Ok(customerOrderVMs);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

        [HttpPost]
        [Route("AddCustomerOrder")]
		
		public IActionResult AddCustomerOrder([FromBody] CustomerOrderViewModel customerOrderViewModel)
        {
            // Start a database transaction; because of this, nothing is fully saved until the end i.e. unless order and order lines are created successfully with no errors, the order isn't placed
            var transaction = _repository.BeginTransaction();

            try
            {
                //get this customer's most recent quote because it has the correct confirmed price. I can't trust what I get from the client when it comes to money and payments
                var mostRecentQuote = _repository.GetCustomerMostRecentQuote(customerOrderViewModel.CustomerId);
                if (mostRecentQuote == null) return NotFound("The quote does not exist on the B.O.X System");

                if (mostRecentQuote.QuoteStatusID != 2) //2 status = 'Accepted'; a quote must be accepted before you can order from it
                    return NotFound("You have not yet accepted the quote. If you think this is an error, give a few minutes for the changes to the quote to reflect. If the issue persists, please contact B.O.X. support");

                //check if order has already been placed from this quote
                var result = CheckForExistingOrder(customerOrderViewModel.QuoteID, customerOrderViewModel.CustomerId);

                //result is of type IActionResult 
                if (result is OkObjectResult okResult && okResult.Value is bool orderExists)
                {
                    if (orderExists) //if an order has already been placed from this quote
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, "An order has already been placed from this quote.");
                    }
                }

                var quoteLines = _repository.GetQuoteLinesByQuote(mostRecentQuote.QuoteID);
                if (quoteLines == null) return NotFound("The quote does not exist on the B.O.X System"); //a quote must have at least 1 line

                //CREATE NEW ORDER FROM VM
                var order = new Customer_Order
                {
                    UserId = customerOrderViewModel.CustomerId,
                    QuoteID = mostRecentQuote.QuoteID,
                    CustomerOrderStatusID = 1, //status of 'Placed'. Statuses can't be CRUDed so this can be hard coded
                    Delivery_Photo = Convert.FromBase64String(""),
                    Date = DateTime.Now,
                    Delivery_Date = CalculateTwoDaysFromNowOnWeekday(),
                    Delivery_Type = customerOrderViewModel.DeliveryType
                };

                _repository.Add(order);
                _repository.SaveChanges(); // Save the order and generate ID

                //check that all order lines from the most recent quote match THE ORDER LINES VM and put in order_line entity
                for(int i = 0; i < customerOrderViewModel.OrderLines.Count(); i++)
                {
                    var line = customerOrderViewModel.OrderLines[i];
                    var qLine = quoteLines[i];

                    if (line.ConfirmedUnitPrice == qLine.Confirmed_Unit_Price) //if prices match
                    {
                        bool fpOrdered = line.FixedProductID != 0; //TRUE IF FIXED PROD WAS ORDERED

                        var orderLineRecord = new Customer_Order_Line
                        {
                            CustomerOrderID = order.CustomerOrderID, //it's NB to save the order 1st so SQL generates its ID to use in the order line
                            Customer_Order = order,
                            CustomProductID = fpOrdered ? null : line.CustomProductID,
                            FixedProductID = !fpOrdered ? null : line.FixedProductID,
                            Quantity = line.Quantity,
                            Confirmed_Unit_Price = line.ConfirmedUnitPrice
                        };

                        //decrease qty on hand for fixed products
                        if (fpOrdered)
                        {
                            var fixedProd = _repository.GetFixedProduct(line.FixedProductID); // Synchronous call

                            //don't allow them to order if there isn't enough stock on hand
                            if (fixedProd.Quantity_On_Hand < line.Quantity)
                            {
                                transaction.Rollback();
                                return StatusCode(StatusCodes.Status400BadRequest, "Insufficient stock on hand.");
                            }

                            fixedProd.Quantity_On_Hand -= line.Quantity;
                        }

                        _repository.Add(orderLineRecord); //save order line in DB
                    }
                    else
                    {
                        transaction.Rollback(); // Rollback the transaction if an exception occurs
                        return StatusCode(StatusCodes.Status400BadRequest, "The price from the client does not match the price from the database");
                    }
                }

                _repository.SaveChanges(); // Save changes for order lines

                transaction.Commit(); // Commit the transaction; everything is fully saved now

                return Ok(customerOrderViewModel);
            }
            catch (Exception ex)
            {
                transaction.Rollback(); // Rollback the transaction if an exception occurs
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services. " + ex.Message + " has inner exception of " + ex.InnerException);
            }

			//this is a function whch calcualtes the expected delivery date for when an order is initially placed:
			 DateTime CalculateTwoDaysFromNowOnWeekday()
			{
				DateTime currentDate = DateTime.Now.Date;
				DateTime futureDate = currentDate.AddDays(2); // Adding two days

				// Check if the future date falls on a weekend (Saturday or Sunday)
				while (futureDate.DayOfWeek == DayOfWeek.Saturday || futureDate.DayOfWeek == DayOfWeek.Sunday)
				{
					futureDate = futureDate.AddDays(1); // Move to the next day
				}

				return futureDate;
			}



		}


        //[HttpPost]
        /*[Route("AddCustomerOrder")]
        public async Task<IActionResult> AddCustomerOrder([FromBody] CustomerOrderViewModel customerOrderViewModel)
        {
            // Create a new instance of Customer from the view model
            var order = new Customer_Order
            {
                UserId = customerOrderViewModel.CustomerId,
                QuoteID = customerOrderViewModel.QuoteID,
                CustomerOrderStatusID = 1, //status of 'Placed'. Statuses can't be CRUDed so this can be hard coded
                Delivery_Photo = Convert.FromBase64String(""),
                Date = customerOrderViewModel.Date,
                Delivery_Type = customerOrderViewModel.DeliveryType
            };

            try
            {
                _repository.Add(order); // Save the order in the repository
                _repository.SaveChanges(); //save change to generate ID

                //get all order lines from the VM and put in order_line entity
                for (int i = 0; i < customerOrderViewModel.OrderLines.Count(); i++)
                {
                    var orderLineVM = customerOrderViewModel.OrderLines[i];
                    bool fpOrdered = orderLineVM.FixedProductID == 0 ? false : true; //true if fixed product was ordered
                    bool cpOrdered = orderLineVM.CustomProductID == 0 ? false : true; //true if custom product was ordered

                    Customer_Order_Line orderLineRecord = new Customer_Order_Line
                    {
                        CustomerOrderID = order.CustomerOrderID, //it's NB to save the order 1st so SQL generates its ID to use in the order line
                        Customer_Order = order,
                        CustomProductID = cpOrdered ? null : orderLineVM.CustomProductID,
                        FixedProductID = fpOrdered ? null : orderLineVM.FixedProductID,
                        Quantity = orderLineVM.Quantity,
                        Confirmed_Unit_Price = orderLineVM.ConfirmedUnitPrice
                    };

                    //decrease quantity on hand of fixed product
                    if (fpOrdered) //fix prod was ordered
                    {
                        Fixed_Product fixedProd = await _repository.GetFixedProductAsync(orderLineVM.FixedProductID); //returns Task<Fixed_Product>
                        fixedProd.Quantity_On_Hand -= orderLineVM.Quantity;
                    }

                    _repository.Add(orderLineRecord); //save estimate line in DB
                }

                // Save changes in the repository
                _repository.SaveChanges();

                return Ok(customerOrderViewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services. " + ex.Message + " has inner exception of " + ex.InnerException);
            }
        }*/

        //check if there is an order that has been placed from that quote; returns true if there is
        [HttpGet]
        [Route("CheckForExistingOrder/{quoteId}/{customerId}")]
        public IActionResult CheckForExistingOrder(int quoteId, string customerId)
        {
            try
            {
                var customerOrder = _repository.GetOrdersByCustomer(customerId, quoteId);

                bool orderExists = customerOrder != null;
                return Ok(orderExists);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
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

                if (existingCustomerOrder == null) return NotFound($"The order does not exist on the B.O.X System");
                if (existingCustomerOrderStatus == null) return NotFound($"The order status does not exist on the B.O.X System");

                existingCustomerOrder.CustomerOrderStatusID = customerOrderStatusId; //update status

                await _repository.SaveChangesAsync();

                return Ok(existingCustomerOrder);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }

		[HttpPut]
		[Route("UpdateDeliveryDate/{customerOrderId}/{newDeliveryDate}")]
		public async Task<IActionResult> UpdateDeliveryDate(int customerOrderId, DateTime newDeliveryDate)
		{
			try
			{
				var existingOrder = await _repository.GetCustomerOrderAsync(customerOrderId);

				if (existingOrder == null)
				{
					return NotFound("The order does not exist on the B.O.X System");
				}

				existingOrder.Delivery_Date = newDeliveryDate;
				await _repository.SaveChangesAsync();

				return Ok(existingOrder);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
			}
		}


	}



}
