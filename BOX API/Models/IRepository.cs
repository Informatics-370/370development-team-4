using BOX.Migrations;

namespace BOX.Models
{
    public interface IRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();

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


        //--------------------------------------------------------- REFUND REASON -------------------------------------------------------------
        Task<Customer_Refund_Reason[]> GetAllCustomerRefundfReasonsAsync();
        Task<Customer_Refund_Reason> GetCustomerRefundReasonAsync(int sizeId);


        //------------------------------------------------------------- VAT -------------------------------------------------------------------
        Task<VAT[]> GetAllVatAsync();
        Task<VAT> GetVatAsync(int vatId);


        //-------------------------------------------------------- RAW MATERIAL ---------------------------------------------------------------
        Task<Raw_Material[]> GetAllRawMaterialsAsync();
        Task<Raw_Material> GetRawMaterialAsync(int? rawmaterialId);


        //------------------------------------------------------ ESTIMATE DURATION ------------------------------------------------------------
        Task<Estimate_Duration[]> GetAllEstimateDurationsAsync();
        Task<Estimate_Duration> GetEstimateDurationAsync(int estimatedurationId);
        //-----------------------QR CODE-----------------------
        Task<QR_Code> GetQRCodeAsync(int codeId);


        //---------------------------------------------------------- SUPPLIER -----------------------------------------------------------------
        Task<Supplier[]> GetAllSuppliersAsync();
        Task<Supplier> GetSupplierAsync(int supplierId);

        //-------------------------------------------------------- FIXED PRODUCT -----------------------------------------------------------------
        Task<Fixed_Product[]> GetAllFixedProductsAsync();
        Task<Fixed_Product> GetFixedProductAsync(int? fixedProductId);
        Task UpdateFixedProductAsync(Fixed_Product fixedProduct);


        //------------------------------------- COST PRICE FORMULA VARIABLES -------------------------------------
        Task<Cost_Price_Formula_Variables[]> GetAllFormulaVariablesAsync();
        Task<Cost_Price_Formula_Variables> GetFormulaVariablesAsync(int formulaVariablesID);

        //------------------------------------------------------ ESTIMATE STATUS ------------------------------------------------------------
        Task<Estimate_Status[]> GetAllEstimateStatusesAsync();
        Task<Estimate_Status> GetEstimateStatusAsync(int estimateStatusId);

        //---------------------------------------------ESTIMATE--------------------------------------------------------------------
        Task<Estimate[]> GetAllEstimatesAsync();
        Task<Estimate> GetEstimateAsync(int estimateId);
        Task UpdateEstimateAsync(Estimate estimate);

        //-----------------------------------------------ESTIMATE LINE---------------------------------------------
        Task<Estimate_Line[]> GetAllEstimateLinesAsync();
        Task<Estimate_Line> GetEstimateLineAsync(int estimateId, string customerId,int estimateLineId);
        Task<Estimate_Line[]> GetEstimateLinesByEstimateAsync(int estimateId);
        Task<Estimate_Line[]> GetEstimateLinesByCustomerAsync(string customerId);

        //------------------------------------------------CUSTOMER--------------------------------------------------
        //Task<Customer> GetCustomerAsync(int customerId);

 

		//------------------------------------------------EMPLOYEE------------------------------------------------------
		//Task<Employee> GetEmployeeAsync(int employeeId);


		//-------------------------------------------------------- CUSTOM PRODUCT -----------------------------------------------------------------
		Task<Custom_Product[]> GetAllCustomProductsAsync();
		Task<Custom_Product> GetCustomProductAsync(int? customProductId);
		Task UpdateCustomProductAsync(Custom_Product customProduct);


        //------------------------------------------------------ CUSTOMER ORDER STATUS ------------------------------------------------------------
        Task<Customer_Order_Status[]> GetAllCustomerOrderStatusesAsync();
        Task<Customer_Order_Status> GetCustomerOrderStatusAsync(int customerOrderstatusId);


        //---------------------------------------------ORDER DELIVERY SCHEDULE--------------------------------------------------------------------
        Task<Order_Delivery_Schedule[]> GetAllCustomerOrderDeliverySchedulesAsync();
        Task<Order_Delivery_Schedule> GetCustomerOrderDeliveryScheduleAsync(int orderDeliveryScheduleId);
        Task UpdateCustomerOrderDeliveryScheduleAsync(Order_Delivery_Schedule order_delivery_Schedule);


        //------------------------------------------------------------- DISCOUNT -------------------------------------------------------------------
        Task<Discount[]> GetAllDiscountsAsync();
        Task<Discount> GetDiscountAsync(int discountId);

        //-------------------------------------------------------- CUSTOMER ORDER -----------------------------------------------------------------
        Task<Customer_Order[]> GetAllCustomerOrdersAsync();
        Task<Customer_Order> GetCustomerOrderAsync(int customerOrderId);
        Task UpdateCustomerOrderAsync(Customer_Order customerOrder);



		//-----------------------------------------------Customer Order LINE---------------------------------------------
		Task<Customer_Order_Line[]> GetAllOrderLinesAsync();
		Task<Customer_Order_Line> GetOrderLineAsync(int customerOrderId, string customerId, int customerOrderLineId);
		Task<Customer_Order_Line[]> GetOrderLinesByOrderAsync(int orderId);
		Task<Customer_Order_Line[]> GetOrderLinesByCustomerAsync(string customerId);

        //------------------------------------------------------------- Supplier Return -------------------------------------------------------------------
        Task<Supplier_Return[]> GetAllSupplierReturnsAsync();
        Task<Supplier_Return> GetSupplierReturnAsync(int supplierReturnId);

        //-------------------------------------------------------- SUPPLIER ORDER -----------------------------------------------------------------
        Task<Supplier_Order[]> GetAllSupplierOrdersAsync();
        Task<Supplier_Order> GetSupplierOrderAsync(int supplierOrderId);



        //-----------------------------------------------SUPPLIER ORDER LINE---------------------------------------------
        Task<Supplier_OrderLine[]> GetAllSupplierOrderLinesAsync();
        Task<Supplier_OrderLine> GetSupplierOrderLineAsync(int supplierOrderId, int supplierId, int supplierOrderLineId);
        Task<Supplier_OrderLine[]> GetSupplierOrderLinesByOrderAsync(int supOrderId);
        Task<Supplier_OrderLine[]> GetSupplierOrderLinesBySupplierAsync(int supplierId);

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

	}

      
 }

