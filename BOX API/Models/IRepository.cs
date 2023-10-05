using Microsoft.EntityFrameworkCore.Storage;

//using BOX.Migrations;

namespace BOX.Models
{
    public interface IRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();

        //FOR SYNCHRONOUS UCs
        bool SaveChanges(); //saves changes synchronously
        IDbContextTransaction BeginTransaction();

        // For our basic CRUDS these are the standard functions we will be creating for the Models we scaffold.
        // Please do not forget to add these.

        //----------------------------------------------------------- SIZES -------------------------------------------------------------------
        Task<Size_Units[]> GetAllSizesAsync();
        Task<Size_Units> GetSizeAsync(int sizeId);


        //-------------------------------------------------------- PRODUCT CATEGORY -----------------------------------------------------------
        Task<Product_Category[]> GetAllCategoriesAsync();
        Task<Product_Category> GetCategoryAsync(int categoryId);
        Task<Size_Variables> GetSizeVariableAsync(int sizeVarId);
        Task<Category_Size_Variables> GetCategorySizeVariablesAsync(int catId);


        //---------------------------------------------------------- PRODUCT ITEM -------------------------------------------------------------
        Task<Product_Item[]> GetAllItemsAsync();
        Task<Product_Item> GetItemAsync(int itemId);


        //-------------------------------------------------------- WRITE OFF REASON -----------------------------------------------------------
        Task<Write_Off_Reason[]> GetAllWriteOffReasonsAsync();
        Task<Write_Off_Reason> GetWriteOffReasonAsync(int writeOffReasonId);


        //--------------------------------------------------------- RETURN REASON -------------------------------------------------------------
        Task<Customer_Return_Reason[]> GetAllCustomerReturnReasonsAsync();
        Task<Customer_Return_Reason> GetCustomerReturnReasonAsync(int sizeId);


        //------------------------------------------------------------- VAT -------------------------------------------------------------------
        Task<VAT[]> GetAllVatAsync();
        Task<VAT> GetVatAsync();


        //-------------------------------------------------------- RAW MATERIAL ---------------------------------------------------------------
        Task<Raw_Material[]> GetAllRawMaterialsAsync();
        Task<Raw_Material> GetRawMaterialAsync(int rawmaterialId);


        //------------------------------------------------------ QUOTE DURATION ------------------------------------------------------------
        Task<Quote_Duration[]> GetAllQuoteDurationsAsync();
        Task<Quote_Duration> GetQuoteDurationAsync(int quotedurationId);
        //-----------------------QR CODE-----------------------
        Task<QR_Code> GetQRCodeAsync(int codeId);


        //---------------------------------------------------------- SUPPLIER -----------------------------------------------------------------
        Task<Supplier[]> GetAllSuppliersAsync();
        Task<Supplier> GetSupplierAsync(int supplierId);

        //-------------------------------------------------------- FIXED PRODUCT -----------------------------------------------------------------
        Task<Fixed_Product[]> GetAllFixedProductsAsync();
        Task<Fixed_Product> GetFixedProductAsync(int fixedProductId);
        Fixed_Product GetFixedProduct(int fixedProductId);
        Task UpdateFixedProductAsync(Fixed_Product fixedProduct);


        //------------------------------------- COST PRICE FORMULA VARIABLES -------------------------------------
        Task<Cost_Price_Formula_Variables[]> GetAllFormulaVariablesAsync();
        Task<Cost_Price_Formula_Variables> GetFormulaVariablesAsync(int formulaVariablesID);

        //------------------------------------------------------ QUOTE STATUS ------------------------------------------------------------
        Task<Quote_Status> GetQuoteStatusAsync(int quoteStatusId);

        //---------------------------------------------QUOTE--------------------------------------------------------------------
        Task<Quote[]> GetAllQuotesAsync();
        Task<Quote> GetQuoteAsync(int quoteId);
        Task<Quote[]> GetQuotesByCustomerAsync(string customerId);
        Quote GetCustomerMostRecentQuote(string customerId); //get quote customer is using to place an order synchronously because it's used in create order function
        Task<Quote[]> GetQuotesByStatus(int statusId);
        Task UpdateQuoteAsync(Quote quote);

        //-----------------------------------------------QUOTE LINE---------------------------------------------
        Task<Quote_Line[]> GetQuoteLinesByQuoteAsync(int quoteId);
        Quote_Line[] GetQuoteLinesByQuote(int quoteId);

        //------------------------------------------------CUSTOMER--------------------------------------------------
        //Task<Customer> GetCustomerAsync(int customerId);



        //------------------------------------------------EMPLOYEE------------------------------------------------------
        //Task<Employee> GetEmployeeAsync(int employeeId);


        //-------------------------------------------------------- CUSTOM PRODUCT -----------------------------------------------------------------
        Task<Custom_Product[]> GetAllCustomProductsAsync();
        Task<Custom_Product> GetCustomProductAsync(int customProductId);
        Task UpdateCustomProductAsync(Custom_Product customProduct);


        //------------------------------------------------------ CUSTOMER ORDER STATUS ------------------------------------------------------------
        Task<Customer_Order_Status[]> GetAllCustomerOrderStatusesAsync();
        Task<Customer_Order_Status> GetCustomerOrderStatusAsync(int customerOrderstatusId);


        //---------------------------------------------ORDER DELIVERY SCHEDULE--------------------------------------------------------------------
        Task<Order_Delivery_Schedule[]> GetAllCustomerOrderDeliverySchedulesAsync();
        Task<Order_Delivery_Schedule> GetCustomerOrderDeliveryScheduleAsync(int orderDeliveryScheduleId);
        Task UpdateCustomerOrderDeliveryScheduleAsync(Order_Delivery_Schedule order_delivery_Schedule);

        //------------------------------------------------------------- DISCOUNT -------------------------------------------------------------------
        Task<Bulk_Discount[]> GetAllDiscountsAsync();
        Task<Bulk_Discount> GetDiscountAsync(int discountId);

        //-------------------------------------------------------- CUSTOMER ORDER -----------------------------------------------------------------
        Task<Customer_Order[]> GetAllCustomerOrdersAsync();
        Task<Customer_Order> GetCustomerOrderAsync(int customerOrderId);
        Task<Customer_Order[]> GetOrdersByCustomerAsync(string customerId);
        Customer_Order GetOrdersByCustomer(string customerId, int quoteId); //get orders for this customer synchronously
        Task<Customer_Order[]> GetCustomerOrdersByDeliverySchedule(int orderDeliveryScheduleId);
        Task<Customer_Order[]> GetCustomerOrdersByStatus(int statusId);
        Task<Customer_Order> GetOrderByCodeAsync(string code);

        //-----------------------------------------------Customer Order LINE---------------------------------------------
        Task<Customer_Order_Line[]> GetOrderLinesByOrderAsync(int orderId);
        Task<Customer_Order_Line> GetOrderLineAsync(int orderLineId);

        //----------------------------------------------- Customer Order Line Status ---------------------------------------------
        Task<Order_Line_Status> GetOrderLineStatusAsync(int statusId);

        //------------------------------------------------------------- Supplier Return -------------------------------------------------------------------
        Task<Supplier_Return[]> GetAllSupplierReturnsAsync();
        Task<Supplier_Return> GetSupplierReturnAsync(int supplierReturnId);

        //-------------------------------------------------------- SUPPLIER ORDER -----------------------------------------------------------------
        Task<Supplier_Order[]> GetAllSupplierOrdersAsync();
        Task<Supplier_Order> GetSupplierOrderAsync(int supplierOrderId);

        //-----------------------------------------------SUPPLIER ORDER LINE---------------------------------------------
        Task<Supplier_OrderLine[]> GetAllSupplierOrderLinesAsync();
        Task<Supplier_OrderLine[]> GetSupplierOrderLinesByOrderAsync(int supOrderId);

        //------------------------------------------------ROLE------------------------------------------------------
        Task<Role[]> GetAllRolesAsync();
        Task<Role> GetRoleAsync(int RoleId);

        //--------------------------- CREDIT APPLICATION STATUS --------------------------
        Task<Credit_Application_Status[]> GetAllAppStatusesAsync();
        Task<Credit_Application_Status> GetAppStatusAsync(int applicationId);

        //--------------------------- CREDIT APPLICATION --------------------------
        Task<Credit_Application[]> GetCreditApplicationsAsync();
        Task<Credit_Application[]> SubmitApplicationAsync(Credit_Application creditApplication);
        Task UploadCreditApplicationAsync(IFormFile file);
        Task<Stream> DownloadCreditApplicationAsync(string fileName);

        //--------------------------- STOCK TAKE ----------------------------------------
        Task<Stock_Take[]> GetAllStockTakeAsync();
        Task<Stock_Take> GetStockTakeAsync(int stockTakeId);

        //------------------------------------------------------------- FIXED PRODUCT PRICE-------------------------------------------------------------------
        Task<Price> GetPriceByFixedProductAsync(int fixedProductId);

        //-------------------------------------------------------- QUOTE REQUEST -----------------------------------------------------------------
        Task<Quote_Request[]> GetAllActiveQuoteRequests();
        Task<Quote_Request> GetQuoteRequestAsync(int quoteRequestId);
        Task<Quote_Request> CheckForActiveQuoteRequestAsync(string customerId);

        //-----------------------------------------------QUOTE REQUEST LINE---------------------------------------------
        Task<Quote_Request_Line[]> GetQuoteRequestLinesByQuoteRequestAsync(int quoteRequestId);

        //----------------------------------------------- USERS -----------------------------------------------
        Task<User> GetUserAsync(string userId);
        Task<string>GetUserFullNameAsync(string userId);

        //----------------------------------------------- REJECT REASON -----------------------------------------------
        Task<Reject_Reason[]> GetAllRejectReasonsAsync();
        Task<Reject_Reason> GetRejectReasonAsync(int rejectReasonId);

        //----------------------------------------------- PRICE MATCH FILE -----------------------------------------------
        Task<Price_Match_File> GetPriceMatchFileByQuoteAsync(int quoteId);

        //----------------------------------------------- REPORTS -----------------------------------------------
        Task<Customer_Order[]> GetOrdersWithinRangeAsync(DateTime startDate, DateTime endDate);
        Task<Customer_Order[]> GetCustomerOrdersWithinRange(string customerId, DateTime startDate, DateTime endDate);
        Task<Supplier_OrderLine[]> GetSupplierOrderLinesByProductAsync(int productId, bool isFixedProduct = true);
        Task<Customer_Order[]> GetOrdersByDeliveryDateAsync(DateTime date);

        //----------------------------------------------- CUSTOMER -----------------------------------------------
        Task<Customer[]> GetAllCustomersAsync();

        //-------------------------------------------- EMPLOYEE -----------------------------------
        Task<Employee> GetEmployeeByUserId(string userId);
        Task<Admin> GetAdminByUserId(string userId);
        Task<Customer> GetCustomerByUserId(string userId);

        //--------------------------- DELIVERY TYPE --------------------------
        Task<Delivery_Type> GetDeliveryTypeAsync(int deliveryTypeId);

        //-------------------------------------------------------- PAYMENT --------------------------------------------------------
        Payment GetPayment(int paymentId);

        //---------------------------------------------------- PAYMENT TYPE ----------------------------------------------------
        Task<Payment_Type> GetPaymentTypeAsync(int paymentTypeId);

        //------------------------------------------------------ REVIEW ------------------------------------------------------------
        Task<Customer_Review> GetReviewAsync(int reviewId);
    }
}