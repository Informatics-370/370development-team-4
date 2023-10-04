using BOX.ViewModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace BOX.Models
{


    public class Repository : IRepository
    {
        private readonly AppDbContext _appDbContext;

        public Repository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        //Allows create functionality-- Never delete this
        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }
        //Allows delete functionality-- Never delete this
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }

        //----------------------------------------------------------- SIZES -------------------------------------------------------------------

        //Gets all Sizes
        public async Task<Size_Units[]> GetAllSizesAsync()
        {
            IQueryable<Size_Units> query = _appDbContext.Size_Units;
            return await query.ToArrayAsync();
        }
        //Gets one Size according to the ID
        public async Task<Size_Units> GetSizeAsync(int sizeId)
        {
            //Query to select product item where the ID passing through the API matches the ID in the Database
            IQueryable<Size_Units> query = _appDbContext.Size_Units.Where(c => c.SizeID == sizeId);
            return await query.FirstOrDefaultAsync();
        }

        //-------------------------------------------------------- PRODUCT CATEGORY -----------------------------------------------------------

        //Get All Categories
        public async Task<Product_Category[]> GetAllCategoriesAsync()
        {
            IQueryable<Product_Category> query = _appDbContext.Product_Category;
            return await query.ToArrayAsync();
        }

        //Get Category By ID
        public async Task<Product_Category> GetCategoryAsync(int categoryId)
        {
            //Query to select product item where the ID passing through the API matches the ID in the Database
            IQueryable<Product_Category> query = _appDbContext.Product_Category.Where(c => c.CategoryID == categoryId);
            return await query.FirstOrDefaultAsync();
        }



        public async Task<Size_Variables> GetSizeVariableAsync(int sizeVarId) //Get size variable by ID
        {
            IQueryable<Size_Variables> query = _appDbContext.Size_Variables.Where(c => c.SizeVariablesID == sizeVarId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Category_Size_Variables> GetCategorySizeVariablesAsync(int catId) //Get category_size_variable by category ID
        {
            //Query to select product item where the ID passing through the API matches the ID in the Database
            IQueryable<Category_Size_Variables> query = _appDbContext.Category_Size_Variables.Where(c => c.CategoryID == catId);
            return await query.FirstOrDefaultAsync();
        }

        //---------------------------------------------------------- PRODUCT ITEM -------------------------------------------------------------
        //Get All Product Items
        public async Task<Product_Item[]> GetAllItemsAsync()
        {
            IQueryable<Product_Item> query = _appDbContext.Product_Item;
            return await query.ToArrayAsync();
        }

        //Get Product Item By ID
        public async Task<Product_Item> GetItemAsync(int itemId)
        {
            //Query to select product item where the ID passing through the API matches the ID in the Database
            IQueryable<Product_Item> query = _appDbContext.Product_Item.Where(c => c.ItemID == itemId);
            return await query.FirstOrDefaultAsync();//Return first occurance of product item with a specific ID
        }

        //-------------------------------------------------------- WRITE OFF REASON -----------------------------------------------------------

        //Gets all Write Off Reasons
        public async Task<Write_Off_Reason[]> GetAllWriteOffReasonsAsync()
        {
            IQueryable<Write_Off_Reason> query = _appDbContext.Write_Off_Reason;
            return await query.ToArrayAsync();
        }

        //Gets Write Off Reason By ID
        public async Task<Write_Off_Reason> GetWriteOffReasonAsync(int writeoffreasonId)
        {
            //Query to select write off reason where the ID passing through the API matches the ID in the Database
            IQueryable<Write_Off_Reason> query = _appDbContext.Write_Off_Reason.Where(c => c.WriteOffReasonID == writeoffreasonId);
            return await query.FirstOrDefaultAsync();
        }

        //--------------------------------------------------------- REFUND REASON -------------------------------------------------------------

        //Get All Refund Reasons
        public async Task<Customer_Return_Reason[]> GetAllCustomerReturnReasonsAsync()
        {
            IQueryable<Customer_Return_Reason> query = _appDbContext.Customer_Return_Reason;
            return await query.ToArrayAsync();
        }

        //Gets one Refund Reason according to the ID
        public async Task<Customer_Return_Reason> GetCustomerReturnReasonAsync(int customerrefundreasonId)
        {
            //Query to select refund reason where the ID passing through the API matches the ID in the Database
            IQueryable<Customer_Return_Reason> query = _appDbContext.Customer_Return_Reason.Where(c => c.CustomerReturnReasonID == customerrefundreasonId);
            return await query.FirstOrDefaultAsync();
        }



        //------------------------------------------------------------- VAT -------------------------------------------------------------------

        //Get Al VAT
        public async Task<VAT[]> GetAllVatAsync()
        {
            IQueryable<VAT> query = _appDbContext.VAT;
            return await query.ToArrayAsync();
        }

        //Get applicable VAT i.e. VAT with most recent date
        public async Task<VAT> GetVatAsync()
        {
            var allVAT = _appDbContext.VAT.ToArray(); //don't want it to run async because I need the data converted to array before I can execute next line

            if (allVAT != null)
            {
                VAT mostRecentVAT = allVAT[0];

                foreach (var vat in allVAT)
                {
                    if (vat.Date > mostRecentVAT.Date)
                    {
                        mostRecentVAT = vat;
                    }
                }

                return mostRecentVAT;
            }
            else
            {
                return null;
            }
        }

        //------------------------------------------------------ QUOTE DURATION ------------------------------------------------------------


        public async Task<Quote_Duration[]> GetAllQuoteDurationsAsync()
        {
            IQueryable<Quote_Duration> query = _appDbContext.Quote_Duration;
            return await query.ToArrayAsync();
        }

        public async Task<Quote_Duration> GetQuoteDurationAsync(int quotedurationId)
        {
            //Query to select quote duration where the ID passing through the API matches the ID in the Database
            IQueryable<Quote_Duration> query = _appDbContext.Quote_Duration.Where(c => c.QuoteDurationID == quotedurationId);
            return await query.FirstOrDefaultAsync();
        }

        //-------------------------------------------------------- RAW MATERIAL ---------------------------------------------------------------

        public async Task<Raw_Material[]> GetAllRawMaterialsAsync()
        {
            IQueryable<Raw_Material> query = _appDbContext.Raw_Material;
            return await query.ToArrayAsync();
        }

        public async Task<Raw_Material> GetRawMaterialAsync(int rawmaterialId)
        {
            //Query to select raw material where the ID passing through the API matches the ID in the Database
            IQueryable<Raw_Material> query = _appDbContext.Raw_Material.Where(c => c.RawMaterialID == rawmaterialId);
            return await query.FirstOrDefaultAsync();
        }

        //---------------------------------------------------------- SUPPLIER -----------------------------------------------------------------

        //Get All Suppliers
        public async Task<Supplier[]> GetAllSuppliersAsync()
        {
            IQueryable<Supplier> query = _appDbContext.Supplier;
            return await query.ToArrayAsync();
        }

        //Gets one Supplier according to the ID
        public async Task<Supplier> GetSupplierAsync(int supplierId)
        {
            //Query to select supplier where the ID passing through the API matches the ID in the Database
            IQueryable<Supplier> query = _appDbContext.Supplier.Where(c => c.SupplierID == supplierId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------- FIXED PRODUCT -----------------------------------------------------------------

        //Get All Fixed Products
        public async Task<Fixed_Product[]> GetAllFixedProductsAsync()
        {
            IQueryable<Fixed_Product> query = _appDbContext.Fixed_Product;
            return await query.ToArrayAsync();
        }

        //Gets one Fixed Product according to the ID
        public async Task<Fixed_Product> GetFixedProductAsync(int fixedProductId)
        {
            //Query to select fixed product where the ID passing through the API matches the ID in the Database
            IQueryable<Fixed_Product> query = _appDbContext.Fixed_Product.Where(c => c.FixedProductID == fixedProductId);
            return await query.FirstOrDefaultAsync();
        }

        //Gets Fixed Product SYNCHRONOUSLY
        public Fixed_Product GetFixedProduct(int fixedProductId)
        {
            //Query to select fixed product where the ID passing through the API matches the ID in the Database
            IQueryable<Fixed_Product> query = _appDbContext.Fixed_Product.Where(c => c.FixedProductID == fixedProductId);
            return query.FirstOrDefault();
        }

        public async Task UpdateFixedProductAsync(Fixed_Product fixedProduct)
        {
            // Update the fixed product entity in the data storage
            _appDbContext.Update(fixedProduct);

            await _appDbContext.SaveChangesAsync();
        }

        //-----------------------QR CODE-----------------------
        public async Task<QR_Code> GetQRCodeAsync(int codeId)
        {
            IQueryable<QR_Code> query = _appDbContext.QR_Code.Where(c => c.QRCodeID == codeId);
            return await query.FirstOrDefaultAsync();
        }

        //-------------------------------------------------------- COST PRICE FORMULA VARIABLES -----------------------------------------------------------
        public async Task<Cost_Price_Formula_Variables[]> GetAllFormulaVariablesAsync()
        {
            IQueryable<Cost_Price_Formula_Variables> query = _appDbContext.cost_Price_Formula_Variables;
            return await query.ToArrayAsync();
        }

        public async Task<Cost_Price_Formula_Variables> GetFormulaVariablesAsync(int formulaVariablesID)
        {
            IQueryable<Cost_Price_Formula_Variables> query = _appDbContext.cost_Price_Formula_Variables.Where(c => c.FormulaID == formulaVariablesID);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------ QUOTE STATUS ------------------------------------------------------------
        public async Task<Quote_Status> GetQuoteStatusAsync(int quoteStatusId)
        {
            //Query to select quote duration where the ID passing through the API matches the ID in the Database
            IQueryable<Quote_Status> query = _appDbContext.Quote_Status.Where(c => c.QuoteStatusID == quoteStatusId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------ QUOTE ------------------------------------------------------------
        public async Task<Quote[]> GetAllQuotesAsync()
        {
            IQueryable<Quote> query = _appDbContext.Quote;
            return await query.ToArrayAsync();
        }

        //Gets one Quote  according to the ID
        public async Task<Quote> GetQuoteAsync(int quoteId)
        {
            //Query to select quote where the ID passing through the API matches the ID in the Database
            IQueryable<Quote> query = _appDbContext.Quote.Where(c => c.QuoteID == quoteId);
            return await query.FirstOrDefaultAsync();
        }
        
        //get all quotes for customer A
        public async Task<Quote[]> GetQuotesByCustomerAsync(string customerId)
        {
            IQueryable<Quote> query = _appDbContext.Quote.Where(c => c.UserId == customerId);
            return await query.ToArrayAsync();
        }

        //get quote customer is about to order from i.e. quote with most recent date and status set to 'Accepted'
        public Quote GetCustomerMostRecentQuote(string customerId)
        {
            var allCustomerQuotes = _appDbContext.Quote.Where(c => c.UserId == customerId).ToArray();

            if (allCustomerQuotes != null && allCustomerQuotes.Length > 0)
            {
                //get quote generated most recently
                Quote mostRecentQuote = allCustomerQuotes[0];

                foreach (var quote in allCustomerQuotes)
                {
                    if (quote.Date_Generated > mostRecentQuote.Date_Generated)
                    {
                        mostRecentQuote = quote;
                    }
                }

                return mostRecentQuote;
            }
            else
            {
                return null;
            }
        }

        public async Task<Quote[]> GetQuotesByStatus(int statusId)
        {
            IQueryable<Quote> query = _appDbContext.Quote.Where(c => c.QuoteStatusID == statusId);
            return await query.ToArrayAsync();
        }

        public async Task UpdateQuoteAsync(Quote quote)
        {
            // Update the Quote entity in the data storage
            _appDbContext.Update(quote);

            await _appDbContext.SaveChangesAsync();
        }

        //------------------------------------------------------ QUOTE LINE------------------------------------------------------------

        //gets all quote lines for a specific quote
        public async Task<Quote_Line[]> GetQuoteLinesByQuoteAsync(int quoteId)
        {
            IQueryable<Quote_Line> query = _appDbContext.Quote_Line.Where(c => c.QuoteID == quoteId);
            return await query.ToArrayAsync();
        }

        //gets all quote lines for a specific quote synchronously
        public Quote_Line[] GetQuoteLinesByQuote(int quoteId)
        {
            var query = _appDbContext.Quote_Line.Where(c => c.QuoteID == quoteId);
            return query.ToArray();
        }

        ////----------------------------------------------------CUSTOMER (TEMP)-------------------------------------
        //public async Task<Customer> GetCustomerAsync(int customerId)
        //{
        //    //Query to select fixed product where the ID passing through the API matches the ID in the Database
        //    IQueryable<Customer> query = _appDbContext.Customer.Where(c => c.customerID == customerId);
        //    return await query.FirstOrDefaultAsync();
        //}

        //----------------------------------------------------ADMIN (TEMP)-------------------------------------
        //public async Task<Admin> GetAdminAsync(int adminId)
        //{
        //    //Query to select fixed product where the ID passing through the API matches the ID in the Database
        //    IQueryable<Admin> query = _appDbContext.Admin.Where(c => c.AdminID == adminId);
        //    return await query.FirstOrDefaultAsync();
        //}

        //------------------------------------------- ROLES ------------------------------------
        //Get All Roles
        public async Task<Role[]> GetAllRolesAsync()
        {
            IQueryable<Role> query = _appDbContext.Role;
            return await query.ToArrayAsync();
        }

        //Get Role By ID
        public async Task<Role> GetRoleAsync(int RoleId)
        {
            //Query to select role where the ID passing through the API matches the ID in the Database
            IQueryable<Role> query = _appDbContext.Role.Where(r => r.RoleID == RoleId);
            return await query.FirstOrDefaultAsync();
        }


        //--------------------------------- CREDIT APPLICATION STATUS -------------------------
        public async Task<Credit_Application_Status[]> GetAllAppStatusesAsync()
        {
            IQueryable<Credit_Application_Status> query = _appDbContext.Credit_Application_Status;
            return await query.ToArrayAsync();
        }


        public async Task<Credit_Application_Status> GetAppStatusAsync(int applicationId)
        {
            IQueryable<Credit_Application_Status> query = _appDbContext.Credit_Application_Status.Where(s => s.CreditApplicationStatusID == applicationId);
            return await query.FirstOrDefaultAsync();
        }

        //--------------------------------- CREDIT APPLICATION -------------------------

        public async Task<Credit_Application[]> GetCreditApplicationsAsync() //Get All Credit Applications (admin)
        {
            IQueryable<Credit_Application> query = _appDbContext.Credit_Application;
            return await query.ToArrayAsync();
        }

        public async Task<Credit_Application[]> SubmitApplicationAsync(Credit_Application creditApplication) //Submit Credit Applications (Customer)
        {
            _appDbContext.Credit_Application.Add(creditApplication);
            await _appDbContext.SaveChangesAsync();

            // Retrieve and return the updated array of credit applications
            return await _appDbContext.Credit_Application.ToArrayAsync();
        }
        //Upload Credit Application (customer)
        private readonly string _fileStoragePath = Path.Combine(Directory.GetCurrentDirectory(), "CreditApplicationForm");
        public async Task UploadCreditApplicationAsync(IFormFile file)
        {
            string filePath = Path.Combine(_fileStoragePath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
        //Download Credit application (customer) 
        public async Task<Stream> DownloadCreditApplicationAsync(string fileName)
        {
            string filePath = Path.Combine(_fileStoragePath, fileName);

            if (!System.IO.File.Exists(filePath))
                return null;

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return fileStream;
        }

        //----------------------------------------------------EMPLOYEE (TEMP)-------------------------------------
        //public async Task<Employee> GetEmployeeAsync(int employeeId)
        //{
        //	IQueryable<Employee> query = _appDbContext.Employee.Where(c => c.EmployeeID == employeeId);
        //	return await query.FirstOrDefaultAsync();
        //}


        //------------------------------------------------------- CUSTOM PRODUCT -----------------------------------------------------------------

        //Get All Fixed Products
        public async Task<Custom_Product[]> GetAllCustomProductsAsync()
        {
            IQueryable<Custom_Product> query = _appDbContext.Custom_Product;
            return await query.ToArrayAsync();
        }

        //Gets one Fixed Product according to the ID
        public async Task<Custom_Product> GetCustomProductAsync(int customProductId)
        {
            //Query to select fixed product where the ID passing through the API matches the ID in the Database
            IQueryable<Custom_Product> query = _appDbContext.Custom_Product.Where(c => c.CustomProductID == customProductId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task UpdateCustomProductAsync(Custom_Product customProduct)
        {
            // Update the Custom product entity in the data storage
            _appDbContext.Update(customProduct);

            await _appDbContext.SaveChangesAsync();
        }

        //------------------------------------------------------ CUSTOMER STATUS ------------------------------------------------------------


        public async Task<Customer_Order_Status[]> GetAllCustomerOrderStatusesAsync()
        {
            IQueryable<Customer_Order_Status> query = _appDbContext.Customer_Order_Status;
            return await query.ToArrayAsync();
        }

        public async Task<Customer_Order_Status> GetCustomerOrderStatusAsync(int customerOrderstatusId)
        {
            IQueryable<Customer_Order_Status> query = _appDbContext.Customer_Order_Status.Where(c => c.CustomerOrderStatusID == customerOrderstatusId);
            return await query.FirstOrDefaultAsync();
        }



        //------------------------------------------------------ Customer Order Delivery Schedule ------------------------------------------------------------


        public async Task<Order_Delivery_Schedule[]> GetAllCustomerOrderDeliverySchedulesAsync()
        {
            IQueryable<Order_Delivery_Schedule> query = _appDbContext.Order_Delivery_Schedule;
            return await query.ToArrayAsync();
        }


        //Gets one Order Delivery Schedule  according to the ID
        public async Task<Order_Delivery_Schedule> GetCustomerOrderDeliveryScheduleAsync(int orderDeliveryScheduleId)
        {
            //Query to select fixed product where the ID passing through the API matches the ID in the Database
            IQueryable<Order_Delivery_Schedule> query = _appDbContext.Order_Delivery_Schedule.Where(c => c.OrderDeliveryScheduleID == orderDeliveryScheduleId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task UpdateCustomerOrderDeliveryScheduleAsync(Order_Delivery_Schedule order_delivery_schedule)
        {
            // Update the Quote entity in the data storage
            _appDbContext.Update(order_delivery_schedule);

            await _appDbContext.SaveChangesAsync();
        }

        //------------------------------------------------------------- DISCOUNT -------------------------------------------------------------------

        //Get All Discounts
        public async Task<Bulk_Discount[]> GetAllDiscountsAsync()
        {
            IQueryable<Bulk_Discount> query = _appDbContext.Bulk_Discount;
            return await query.ToArrayAsync();
        }

        //Get VAT By ID
        public async Task<Bulk_Discount> GetDiscountAsync(int discountId)
        {
            //Query to select vat where the ID passing through the API matches the ID in the Database
            IQueryable<Bulk_Discount> query = _appDbContext.Bulk_Discount.Where(c => c.DiscountID == discountId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------- CUSTOMER ORDER -----------------------------------------------------------------

        //Get All Customer Orders 
        public async Task<Customer_Order[]> GetAllCustomerOrdersAsync()
        {
            IQueryable<Customer_Order> query = _appDbContext.Customer_Order;
            return await query.ToArrayAsync();
        }

        public async Task<Customer_Order> GetCustomerOrderAsync(int customerOrderId)
        {
            IQueryable<Customer_Order> query = _appDbContext.Customer_Order.Where(c => c.CustomerOrderID == customerOrderId);
            return await query.FirstOrDefaultAsync();
        }

        //Gets all customer order lines from every order customer "A" has ever made
        public async Task<Customer_Order[]> GetOrdersByCustomerAsync(string customerId)
        {
            IQueryable<Customer_Order> query = _appDbContext.Customer_Order.Where(c => c.UserId == customerId);
            return await query.ToArrayAsync();
        }

        public Customer_Order GetOrdersByCustomer(string customerId, int quoteId)
        {
            var query = _appDbContext.Customer_Order.Where(c => c.UserId == customerId && c.QuoteID == quoteId);
            return query.FirstOrDefault();
        }

        public async Task<Customer_Order[]> GetCustomerOrdersByDeliverySchedule(int orderDeliveryScheduleId)
        {
            IQueryable<Customer_Order> query = _appDbContext.Customer_Order.Where(c => c.OrderDeliveryScheduleID == orderDeliveryScheduleId);
            return await query.ToArrayAsync();
        }

        public async Task<Customer_Order[]> GetCustomerOrdersByStatus(int statusId)
        {
            IQueryable<Customer_Order> query = _appDbContext.Customer_Order.Where(c => c.CustomerOrderStatusID == statusId);
            return await query.ToArrayAsync();
        }

        public async Task<Customer_Order> GetOrderByCodeAsync(string code)
        {
            IQueryable<Customer_Order> query = _appDbContext.Customer_Order.Where(c => c.Code == code);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------ Customer Order LINE------------------------------------------------------------
        //gets all Customer Order lines for a specific order
        public async Task<Customer_Order_Line[]> GetOrderLinesByOrderAsync(int orderId)
        {
            IQueryable<Customer_Order_Line> query = _appDbContext.Customer_Order_Line.Where(c => c.CustomerOrderID == orderId);
            return await query.ToArrayAsync();
        }

        public async Task<Customer_Order_Line> GetOrderLineAsync(int orderLineId)
        {
            IQueryable<Customer_Order_Line> query = _appDbContext.Customer_Order_Line.Where(c => c.CustomerOrderLineID == orderLineId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------------- Supplier Return  -------------------------------------------------------------------

        //Get Al VAT
        public async Task<Supplier_Return[]> GetAllSupplierReturnsAsync()
        {
            IQueryable<Supplier_Return> query = _appDbContext.Supplier_Return;
            return await query.ToArrayAsync();
        }

        //Get VAT By ID
        public async Task<Supplier_Return> GetSupplierReturnAsync(int supplierReturnId)
        {
            //Query to select vat where the ID passing through the API matches the ID in the Database
            IQueryable<Supplier_Return> query = _appDbContext.Supplier_Return.Where(c => c.SupplierReturnID == supplierReturnId);
            return await query.FirstOrDefaultAsync();
        }



        //This Deals with the Functionality for Supplier Orders:

        //Explanation--- Wr will be placing Supplier Orders Onto the system, we will be able to filter through and see the Order History for a particular Supplier and what it is they supply us. This is highly likely going to be necessary for one of the Reports


        //------------------------------------------------------- SUPPLIER ORDER -----------------------------------------------------------------

        //Get All Supplier Orders 
        public async Task<Supplier_Order[]> GetAllSupplierOrdersAsync()
        {
            IQueryable<Supplier_Order> query = _appDbContext.Supplier_Order;
            return await query.ToArrayAsync();
        }


        //Gets one Supplier Order according to the ID
        public async Task<Supplier_Order> GetSupplierOrderAsync(int supplierOrderId)
        {
            //Query to select fixed product where the ID passing through the API matches the ID in the Database
            IQueryable<Supplier_Order> query = _appDbContext.Supplier_Order.Where(c => c.SupplierOrderID == supplierOrderId);
            return await query.FirstOrDefaultAsync();
        }


        //------------------------------------------------------ Supplier Order LINE------------------------------------------------------------

        public async Task<Supplier_OrderLine[]> GetAllSupplierOrderLinesAsync()
        {
            IQueryable<Supplier_OrderLine> query = _appDbContext.Supplier_OrderLine;
            return await query.ToArrayAsync();
        }

        //Gets all Supplier Order lines for a specific order
        public async Task<Supplier_OrderLine[]> GetSupplierOrderLinesByOrderAsync(int supOrderId)
        {
            IQueryable<Supplier_OrderLine> query = _appDbContext.Supplier_OrderLine.Where(c => c.SupplierOrderID == supOrderId);
            return await query.ToArrayAsync();
        }

        //----------------------------------------------------- STOCK TAKE --------------------------------
        public async Task<Stock_Take[]> GetAllStockTakeAsync()
        {
            IQueryable<Stock_Take> query = _appDbContext.Stock_Take;
            return await query.ToArrayAsync();
        }

        public async Task<Stock_Take> GetStockTakeAsync(int stockTakeId)
        {
            IQueryable<Stock_Take> query = _appDbContext.Stock_Take.Where(st => st.StockTakeID == stockTakeId);
            return await query.FirstOrDefaultAsync();
        }

        //----------------------------------------------------- FIXED PRODUCT PRICE --------------------------------
        //Get applicable price i.e. price with matching fixed product ID and most recent date
        public async Task<Price> GetPriceByFixedProductAsync(int fixedProductId)
        {
            var allFixedProductPrices = _appDbContext.Price.Where(c => c.FixedProductID == fixedProductId).ToArray(); //don't want it to run async because I need the data converted to array before I can execute next line

            if (allFixedProductPrices != null)
            {
                Price mostRecentPrice = allFixedProductPrices[0];

                foreach (var price in allFixedProductPrices)
                {
                    if (price.Date > mostRecentPrice.Date)
                    {
                        mostRecentPrice = price;
                    }
                }

                return mostRecentPrice;
            }
            else
            {
                return null;
            }
        }
        
        //------------------------------------------------------- QUOTE REQUEST -----------------------------------------------------------------
        public async Task<Quote_Request[]> GetAllActiveQuoteRequests()
        {
            //status 1 = requested; quote has been requested but no one has attended to it
            IQueryable<Quote_Request> query = _appDbContext.Quote_Request.Where(c => c.QuoteRequestStatusID == 1);
            return await query.ToArrayAsync();
        }

        public async Task<Quote_Request> GetQuoteRequestAsync(int quoteRequestId)
        {
            IQueryable<Quote_Request> query = _appDbContext.Quote_Request.Where(c => c.QuoteRequestID == quoteRequestId);
            return await query.FirstOrDefaultAsync();
        }

        //a customer can only have 1 quote request at a time
        public async Task<Quote_Request> CheckForActiveQuoteRequestAsync(string customerId)
        {
            //status 1 = requested; quote has been requested but no one has attended to it
            IQueryable<Quote_Request> query = _appDbContext.Quote_Request.Where(c => c.UserId == customerId && c.QuoteRequestStatusID == 1);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------ QUOTE REQUEST LINE------------------------------------------------------------
        //Gets all Request lines for a specific QR
        public async Task<Quote_Request_Line[]> GetQuoteRequestLinesByQuoteRequestAsync(int quoteRequestId)
        {
            IQueryable<Quote_Request_Line> query = _appDbContext.Quote_Request_Line.Where(c => c.QuoteRequestID == quoteRequestId);
            return await query.ToArrayAsync();
        }

        //----------------------------------------------- USERS -----------------------------------------------        
        public async Task<User> GetUserAsync(string userId)
        {
            IQueryable<User> query = _appDbContext.User.Where(c => c.Id == userId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<string> GetUserFullNameAsync(string userId)
        {
            //get user
            var usersAsArray = _appDbContext.User.Where(c => c.Id == userId).ToArray();
            User user = usersAsArray.FirstOrDefault();

            Title title = null;
            string fullName = "";

            //get title
            if (user.TitleID != null)
            {
                var titleAsArray = _appDbContext.Title.Where(c => c.TitleID == user.TitleID);
                title = titleAsArray.FirstOrDefault();
                //concatenate name
                fullName = title.Description + " " + user.user_FirstName + " " + user.user_LastName;
            }
            else
            {
                //concatenate name
                fullName = user.user_FirstName + " " + user.user_LastName;
            }

            return fullName;
        }

        //----------------------------------------------- REJECT REASON -----------------------------------------------
        public Task<Reject_Reason[]> GetAllRejectReasonsAsync()
        {
            IQueryable<Reject_Reason> query = _appDbContext.Reject_Reason;
            return query.ToArrayAsync();
        }

        public async Task<Reject_Reason> GetRejectReasonAsync(int rejectReasonId)
        {
            IQueryable<Reject_Reason> query = _appDbContext.Reject_Reason.Where(c => c.RejectReasonID == rejectReasonId);
            return await query.FirstOrDefaultAsync();
        }


        //----------------------------------------------- PRICE MATCH FILE -----------------------------------------------
        public async Task<Price_Match_File> GetPriceMatchFileByQuoteAsync(int quoteId)
        {
            IQueryable<Price_Match_File> query = _appDbContext.Price_Match_File.Where(c => c.QuoteID == quoteId);
            return await query.FirstOrDefaultAsync();
        }

        //----------------------------------- CUSTOMER -----------------------------------
        public Task<Customer[]> GetAllCustomersAsync()
        {
            IQueryable<Customer> query = _appDbContext.Customer;
            return query.ToArrayAsync();
        }

        //----------------------------------- REPORTS -----------------------------------
        public Task<Customer_Order[]> GetOrdersWithinRangeAsync(DateTime startDate, DateTime endDate)
        {
            IQueryable<Customer_Order> query = _appDbContext.Customer_Order.Where(c => c.Date >= startDate && c.Date <= endDate);
            return query.ToArrayAsync();
        }

        public Task<Customer_Order[]> GetCustomerOrdersWithinRange(string customerId, DateTime startDate, DateTime endDate)
        {
            IQueryable<Customer_Order> query = _appDbContext.Customer_Order.Where(c => c.UserId == customerId && c.Date >= startDate && c.Date <= endDate);
            return query.ToArrayAsync();
        }

        public Task<Supplier_OrderLine[]> GetSupplierOrderLinesByProductAsync(int productId, bool isFixedProduct = true)
        {
            if (isFixedProduct) //if we're searching for a fixed product
            {
                IQueryable<Supplier_OrderLine> query = _appDbContext.Supplier_OrderLine.Where(c => c.FixedProductID  == productId);
                return query.ToArrayAsync();
            }
            else
            {
                IQueryable<Supplier_OrderLine> query = _appDbContext.Supplier_OrderLine.Where(c => c.RawMaterialID == productId);
                return query.ToArrayAsync();
            }
        }

        //-------------------------------------------- UPATING USER ------------------------------------
        public async Task<Employee> GetEmployeeByUserId(string userId)
        {
            return await _appDbContext.Employee.FirstOrDefaultAsync(e => e.UserId == userId);
        }

        public async Task<Customer> GetCustomerByUserId(string userId)
        {
            return await _appDbContext.Customer.FirstOrDefaultAsync(e => e.UserId == userId);
        }

        public async Task<Admin> GetAdminByUserId(string userId)
        {
            return await _appDbContext.Admin.FirstOrDefaultAsync(e => e.UserId == userId);
        }

        //------------------------------------------------------ DELIVERY TYPE ------------------------------------------------------------
        public async Task<Delivery_Type> GetDeliveryTypeAsync(int deliveryTypeId)
        {
            IQueryable<Delivery_Type> query = _appDbContext.Delivery_Type.Where(c => c.DeliveryTypeID == deliveryTypeId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------ PAYMENT ------------------------------------------------------------
        public Payment GetPayment(int paymentId)
        {
            var query = _appDbContext.Payment.Where(c => c.PaymentID == paymentId);
            return query.FirstOrDefault();
        }

        //------------------------------------------------------ PAYMENT TYPE ------------------------------------------------------------
        public async Task<Payment_Type> GetPaymentTypeAsync(int paymentTypeId)
        {
            IQueryable<Payment_Type> query = _appDbContext.Payment_Type.Where(c => c.PaymentTypeID == paymentTypeId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------ CUSTOMER ORDER LINE STATUS ------------------------------------------------------------
        public async Task<Order_Line_Status> GetOrderLineStatusAsync(int statusId)
        {
            IQueryable<Order_Line_Status> query = _appDbContext.Order_Line_Status.Where(c => c.OrderLineStatusID == statusId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------ CUSTOMER REVIEW ------------------------------------------------------------
        public async Task<Customer_Review> GetReviewAsync(int reviewId)
        {
            IQueryable<Customer_Review> query = _appDbContext.Customer_Review.Where(c => c.CustomerReviewID == reviewId);
            return await query.FirstOrDefaultAsync();
        }

        //--------------------------------- TRANSACTIONS --------------------------------
        public IDbContextTransaction BeginTransaction()
        {
            return _appDbContext.Database.BeginTransaction();
        }

        //---------------------------------------------------------- SAVE CHANGES SYNCHRONOUSLY -----------------------------------------------------------
        public bool SaveChanges()
        {
            return _appDbContext.SaveChanges() > 0;
        }

        //---------------------------------------------------------- SAVE CHANGES ASYNC -----------------------------------------------------------
        //Never remove this line of code, code above the line above.
        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

    }

}
