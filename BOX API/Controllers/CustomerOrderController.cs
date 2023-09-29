using BOX.Models;
using BOX.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System;
using System.Collections.Generic;
using System.IO;
using System.Web;


namespace BOX.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerOrderController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;
        private readonly ILogger<PaymentController> _logger;
        private readonly IRepository _repository;

        public CustomerOrderController(IHttpClientFactory clientFactory, IConfiguration configuration, ILogger<PaymentController> logger, IRepository repository)
        {
            _clientFactory = clientFactory;
            _configuration = configuration;
            _logger = logger;
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
                    var deliveryType = await _repository.GetDeliveryTypeAsync(order.DeliveryTypeID); //get delivery type
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
                        DeliveryTypeID = order.DeliveryTypeID,
                        DeliveryType = deliveryType.Description,
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

                    var lineStatus = await _repository.GetOrderLineStatusAsync(ol.OrderLineStatusID);

                    CustomerOrderLineViewModel olvm = new CustomerOrderLineViewModel()
                    {
                        CustomerOrderLineID = ol.CustomerOrderLineID,
                        FixedProductID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value,
                        FixedProductDescription = fixedProduct.Description,
                        CustomProductID = ol.CustomProductID == null ? 0 : ol.CustomProductID.Value,
                        CustomProductDescription = customProdDescription,
                        Quantity = ol.Quantity,
                        ConfirmedUnitPrice = ol.Confirmed_Unit_Price,
                        CustomerReturnID = ol.CustomerReturnID == null ? 0 : ol.CustomerReturnID.Value,
                        OrderLineStatusID = ol.OrderLineStatusID,
                        OrderLineStatusDescription = lineStatus.Description
                    };
                    orderLineList.Add(olvm);
                }

                var status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID); //get status associated with this customer order
                var deliveryType = await _repository.GetDeliveryTypeAsync(order.DeliveryTypeID); //get delivery type
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
                    DeliveryTypeID = order.DeliveryTypeID,
                    DeliveryType = deliveryType.Description,
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

                        var lineStatus = await _repository.GetOrderLineStatusAsync(ol.OrderLineStatusID);

                        CustomerOrderLineViewModel olVM = new CustomerOrderLineViewModel
                        {
                            CustomerOrderLineID = ol.CustomerOrderLineID,
                            FixedProductID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value,
                            FixedProductDescription = fixedProduct.Description,
                            CustomProductID = ol.CustomProductID == null ? 0 : ol.CustomProductID.Value,
                            CustomProductDescription = customProdDescription,
                            ConfirmedUnitPrice = ol.Confirmed_Unit_Price,
                            Quantity = ol.Quantity,
                            CustomerReturnID = ol.CustomerReturnID == null ? 0 : ol.CustomerReturnID.Value,
                            OrderLineStatusID = ol.OrderLineStatusID,
                            OrderLineStatusDescription = lineStatus.Description
                        };
                        olList.Add(olVM);
                    }

                    string fullName = await _repository.GetUserFullNameAsync(order.UserId);
                    var status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID);
                    var deliveryType = await _repository.GetDeliveryTypeAsync(order.DeliveryTypeID); //get delivery type
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
                        DeliveryTypeID = order.DeliveryTypeID,
                        DeliveryType = deliveryType.Description,
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

        //-------------------------------------------------- PLACE ORDER ------------------------------------------------

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
                    DeliveryTypeID = customerOrderViewModel.DeliveryTypeID
                };

                _repository.Add(order);
                _repository.SaveChanges(); // Save the order and generate ID

                //check that all order lines from the most recent quote match THE ORDER LINES VM and put in order_line entity
                for (int i = 0; i < customerOrderViewModel.OrderLines.Count(); i++)
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
                            Confirmed_Unit_Price = line.ConfirmedUnitPrice,
                            OrderLineStatusID = 1 //set status to 1 - Placed
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

                //attach payment to order
                AttachPaymentToOrder(order.CustomerOrderID, customerOrderViewModel.PaymentID);

                return Ok(order);
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
        [Route("AttachPaymentToOrder")]
        public IActionResult AttachPaymentToOrder(int customerOrderId, int paymentId)
        {
            try
            {
                var existingCustomerOrder = _repository.GetCustomerOrderAsync(customerOrderId); //make sure the order exists on the system
                var existingPayment = _repository.GetPayment(paymentId);

                if (existingCustomerOrder == null) return NotFound($"The order does not exist on the B.O.X System");
                if (existingPayment == null) return NotFound($"The payment does not exist on the B.O.X System");

                existingPayment.CustomerOrderID = customerOrderId;

                _repository.SaveChanges();

                return Ok(existingPayment);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact B.O.X support services.");
            }
        }


        //-------------------- verify payment --------------------
        private string UrlEncode(string value)
        {
            return WebUtility.UrlEncode(value)?.Replace("%20", "+");
        }

        [HttpPost("HandlePaymentResult/{paymentTypeId}")]
        public async Task<IActionResult> HandlePaymentResult(int paymentTypeId, [FromBody] PayFastRequestViewModel payment)
        {
            if (payment == null)
            {
                return BadRequest();
            }

            // Get your passphrase from configuration
            var passphrase = _configuration["PayFast:Passphrase"];

            // Generate a signature from the incoming payment data
            var propertyValues = payment.GetType().GetProperties()
                .Where(p => p.GetValue(payment) != null && p.Name != "signature")
                .Select(p => $"{p.Name}={UrlEncode(p.GetValue(payment).ToString())}");
            var rawData = string.Join("&", propertyValues) + $"&passphrase={passphrase}";

            using (var md5 = MD5.Create())
            {
                var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                var generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();

                // Compare the generated signature with the one in the request
                if (payment.signature != generatedSignature)
                {
                    //_logger.LogError("Payment signature verification failed."); // Log an error, the signatures do not match
                    //return BadRequest("Payment signature verification failed.");
                }
            }

            // If the signatures match, continue with saving the payment to the database
            Payment newPayment = new Payment
            {
                PaymentTypeID = paymentTypeId,
                Date_And_Time = DateTime.Now,
                Amount = payment.amount
            };

            _repository.Add(newPayment); //add payment
            await _repository.SaveChangesAsync(); //save

            // After saving the payment to the database, return a successful response
            return Ok(newPayment);
        }

        //-------------------------------------------------- UPDATE ORDER ------------------------------------------------
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
        [Route("ProcessOrderLine/{orderLineId}/{customerOrderStatusId}")]
        public async Task<IActionResult> ProcessOrderLine(int orderLineId, int customerOrderStatusId)
        {
            try
            {
                var existingCustomerOrderLine = await _repository.GetOrderLineAsync(orderLineId); //make sure the status exists
                if (existingCustomerOrderLine == null) return NotFound($"The order line does not exist on the B.O.X System");

                var existingCustomerOrder = await _repository.GetCustomerOrderAsync(existingCustomerOrderLine.CustomerOrderID); //get order
                var existingOrderLines = await _repository.GetOrderLinesByOrderAsync(existingCustomerOrder.CustomerOrderID); //get all order order lines
                if (existingCustomerOrder == null || existingOrderLines == null) return NotFound($"The order does not exist on the B.O.X System");

                existingCustomerOrderLine.OrderLineStatusID = 2; //update status to 2 - In progress

                //when 1 order line is in progress, whole order status is changed to in progress
                existingCustomerOrder.CustomerOrderStatusID = 2; //2 - In progress

                //if all order lines are in progress, change order status
                bool allLinesInProgress = true;

                foreach (var line in existingOrderLines)
                {
                    if (line.OrderLineStatusID == 1) //if the line isn't in progress
                    {
                        allLinesInProgress = false;
                    }
                }

                if (allLinesInProgress) existingCustomerOrder.CustomerOrderStatusID = 4; //mark order as "Ready for delivery / collection"

                await _repository.SaveChangesAsync();

                return Ok(existingCustomerOrderLine);
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

        [HttpGet]
        [Route("GetAllCustomerOrders/{statusId}")]
        public async Task<IActionResult> GetCustomerOrdersByStatus(int statusId)
        {
            try
            {
                var cusOrders = await _repository.GetCustomerOrdersByStatus(statusId);

                List<CustomerOrderViewModel> customerOrderViewModels = new List<CustomerOrderViewModel>(); //create array of VMs
                foreach (var order in cusOrders)
                {
                    //get all customer order lines associated with this order and create array from them
                    //    List<CustomerOrderLineViewModel> orderLineList = new List<CustomerOrderLineViewModel>();
                    //    var orderLines = await _repository.GetOrderLinesByOrderAsync(order.CustomerOrderID);

                    //    //put all order lines for this specific order in a list for the customer order VM
                    //    foreach (var ol in orderLines)
                    //    {
                    //        CustomerOrderLineViewModel colvm = new CustomerOrderLineViewModel
                    //        {
                    //            CustomerOrderLineID = ol.CustomerOrderLineID,
                    //            FixedProductID = ol.FixedProductID == null ? 0 : ol.FixedProductID.Value,
                    //            CustomProductID = ol.CustomProductID == null ? 0 : ol.CustomProductID.Value,
                    //            ConfirmedUnitPrice = ol.Confirmed_Unit_Price,
                    //            Quantity = ol.Quantity,
                    //            CustomerReturnID = ol.CustomerReturnID == null ? 0 : ol.CustomerReturnID.Value
                    //        };
                    //        orderLineList.Add(colvm);
                    //    }

                    //    var Status = await _repository.GetCustomerOrderStatusAsync(order.CustomerOrderStatusID); //get status associated with this customer order
                    //    var deliveryType = await _repository.GetDeliveryTypeAsync(order.DeliveryTypeID); //get delivery type
                    //    string fullName = await _repository.GetUserFullNameAsync(order.UserId);

                    //    var deliverySchedule = new Order_Delivery_Schedule();

                    //    if (order.OrderDeliveryScheduleID != null)
                    //    {
                    //        int deliveryScheduleID = order.OrderDeliveryScheduleID.Value;
                    //        deliverySchedule = await _repository.GetCustomerOrderDeliveryScheduleAsync(deliveryScheduleID);
                    //    }

                    CustomerOrderViewModel coVM = new CustomerOrderViewModel()
                    {
                        CustomerOrderID = order.CustomerOrderID,
                        QuoteID = order.QuoteID,
                        OrderStatusID = order.CustomerOrderStatusID,
                        //OrderStatusDescription = Status.Description,
                        CustomerId = order.UserId,
                        //CustomerFullName = fullName,
                        //DeliveryScheduleID = deliverySchedule.OrderDeliveryScheduleID,
                        DeliveryDate = (DateTime)order.Delivery_Date,
                        Date = order.Date,
                        DeliveryTypeID = order.DeliveryTypeID,
                        //DeliveryType = deliveryType.Description,
                        DeliveryPhoto = Convert.ToBase64String(order.Delivery_Photo),
                        //OrderLines = orderLineList
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

    }
}
