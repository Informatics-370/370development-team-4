using Microsoft.EntityFrameworkCore;
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
        public async Task<Customer_Refund_Reason[]> GetAllCustomerRefundfReasonsAsync()
        {
            IQueryable<Customer_Refund_Reason> query = _appDbContext.Customer_Refund_Reason;
            return await query.ToArrayAsync();
        }

        //Gets one Refund Reason according to the ID
        public async Task<Customer_Refund_Reason> GetCustomerRefundReasonAsync(int customerrefundreasonId)
        {
            //Query to select refund reason where the ID passing through the API matches the ID in the Database
            IQueryable<Customer_Refund_Reason> query = _appDbContext.Customer_Refund_Reason.Where(c => c.CustomerRefundReasonID == customerrefundreasonId);
            return await query.FirstOrDefaultAsync();
        }



        //------------------------------------------------------------- VAT -------------------------------------------------------------------

        //Get Al VAT
        public async Task<VAT[]> GetAllVatAsync()
        {
            IQueryable<VAT> query = _appDbContext.VAT;
            return await query.ToArrayAsync();
        }

        //Get VAT By ID
        public async Task<VAT> GetVatAsync(int vatId)
        {
            //Query to select vat where the ID passing through the API matches the ID in the Database
            IQueryable<VAT> query = _appDbContext.VAT.Where(c => c.VatID == vatId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------ ESTIMATE DURATION ------------------------------------------------------------


        public async Task<Estimate_Duration[]> GetAllEstimateDurationsAsync()
        {
            IQueryable<Estimate_Duration> query = _appDbContext.Estimate_Duration;
            return await query.ToArrayAsync();
        }

        public async Task<Estimate_Duration> GetEstimateDurationAsync(int estimatedurationId)
        {
            //Query to select estimate duration where the ID passing through the API matches the ID in the Database
            IQueryable<Estimate_Duration> query = _appDbContext.Estimate_Duration.Where(c => c.EstimateDurationID == estimatedurationId);
            return await query.FirstOrDefaultAsync();
        }

        //-------------------------------------------------------- RAW MATERIAL ---------------------------------------------------------------

        public async Task<Raw_Material[]> GetAllRawMaterialsAsync()
        {
            IQueryable<Raw_Material> query = _appDbContext.Raw_Material;
            return await query.ToArrayAsync();
        }

        public async Task<Raw_Material> GetRawMaterialAsync(int? rawmaterialId)
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
        public async Task<Fixed_Product> GetFixedProductAsync(int? fixedProductId)
        {
            //Query to select fixed product where the ID passing through the API matches the ID in the Database
            IQueryable<Fixed_Product> query = _appDbContext.Fixed_Product.Where(c => c.FixedProductID == fixedProductId);
            return await query.FirstOrDefaultAsync();
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

        //------------------------------------------------------ ESTIMATE STATUS ------------------------------------------------------------


        public async Task<Estimate_Status[]> GetAllEstimateStatusesAsync()
        {
            IQueryable<Estimate_Status> query = _appDbContext.Estimate_Status;
            return await query.ToArrayAsync();
        }

        public async Task<Estimate_Status> GetEstimateStatusAsync(int estimateStatusId)
        {
            //Query to select estimate duration where the ID passing through the API matches the ID in the Database
            IQueryable<Estimate_Status> query = _appDbContext.Estimate_Status.Where(c => c.EstimateStatusID == estimateStatusId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------------------------------ ESTIMATE ------------------------------------------------------------


        public async Task<Estimate[]> GetAllEstimatesAsync()
        {
            IQueryable<Estimate> query = _appDbContext.Estimate;
            return await query.ToArrayAsync();
        }


        //Gets one Estimate  according to the ID
        public async Task<Estimate> GetEstimateAsync(int estimateId)
        {
            //Query to select estimate where the ID passing through the API matches the ID in the Database
            IQueryable<Estimate> query = _appDbContext.Estimate.Where(c => c.EstimateID == estimateId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task UpdateEstimateAsync(Estimate estimate)
        {
            // Update the Estimate entity in the data storage
            _appDbContext.Update(estimate);

            await _appDbContext.SaveChangesAsync();
        }

        //------------------------------------------------------ ESTIMATE LINE------------------------------------------------------------


        public async Task<Estimate_Line[]> GetAllEstimateLinesAsync()
        {
            IQueryable<Estimate_Line> query = _appDbContext.Estimate_Line;
            return await query.ToArrayAsync();
        }

        //Gets one Estimate line  according to the concatenated ID
        public async Task<Estimate_Line> GetEstimateLineAsync(int estimateId, string customerId, int estimateLineId) //int estimateLineId)
        {
            IQueryable<Estimate_Line> query = _appDbContext.Estimate_Line
             .Where(c => c.EstimateID == estimateId && c.UserId == customerId && c.EstimateLineID == estimateLineId);
            return await query.FirstOrDefaultAsync();

        }

        //gets all estimate lines for a specific estimate
        public async Task<Estimate_Line[]> GetEstimateLinesByEstimateAsync(int estimateId)
        {
            IQueryable<Estimate_Line> query = _appDbContext.Estimate_Line.Where(c => c.EstimateID == estimateId);
            return await query.ToArrayAsync();
        }

        //Gets all estimate lines from every estimate customer A has ever made
        public async Task<Estimate_Line[]> GetEstimateLinesByCustomerAsync(string customerId)
        {
            IQueryable<Estimate_Line> query = _appDbContext.Estimate_Line.Where(c => c.UserId == customerId);
            return await query.ToArrayAsync();
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
		public async Task<Custom_Product> GetCustomProductAsync(int? customProductId)
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
            // Update the Estimate entity in the data storage
            _appDbContext.Update(order_delivery_schedule);

            await _appDbContext.SaveChangesAsync();
        }

		//------------------------------------------------------------- DISCOUNT -------------------------------------------------------------------

		//Get All Discounts
		public async Task<Discount[]> GetAllDiscountsAsync()
		{
			IQueryable<Discount> query = _appDbContext.Discount;
			return await query.ToArrayAsync();
		}

		//Get VAT By ID
		public async Task<Discount> GetDiscountAsync(int discountId)
		{
			//Query to select vat where the ID passing through the API matches the ID in the Database
			IQueryable<Discount> query = _appDbContext.Discount.Where(c => c.DiscountID == discountId);
			return await query.FirstOrDefaultAsync();
		}

		//------------------------------------------------------- CUSTOMER ORDER -----------------------------------------------------------------

		//Get All Customer Orders 
		public async Task<Customer_Order[]> GetAllCustomerOrdersAsync()
		{
			IQueryable<Customer_Order> query = _appDbContext.Customer_Order;
			return await query.ToArrayAsync();
		}

		//Gets one Fixed Product according to the ID
		public async Task<Customer_Order> GetCustomerOrderAsync(int customerOrderId)
		{
			//Query to select fixed product where the ID passing through the API matches the ID in the Database
			IQueryable<Customer_Order> query = _appDbContext.Customer_Order.Where(c => c.CustomerOrderID == customerOrderId);
			return await query.FirstOrDefaultAsync();
		}

		public async Task UpdateCustomerOrderAsync(Customer_Order customerOrder)
		{
			// Update the Customer Order entity in the data storage
			_appDbContext.Update(customerOrder);

			await _appDbContext.SaveChangesAsync();
		}

		//------------------------------------------------------ Customer Order LINE------------------------------------------------------------


		public async Task<Customer_Order_Line[]> GetAllOrderLinesAsync()
		{
			IQueryable<Customer_Order_Line> query = _appDbContext.Customer_Order_Line;
			return await query.ToArrayAsync();
		}

		//Gets one Customer Order line  according to the concatenated ID
		public async Task<Customer_Order_Line> GetOrderLineAsync(int customerOrderId, string customerId,int customerOrderLineId) //int customerOrderLineID)
		{
			IQueryable<Customer_Order_Line> query = _appDbContext.Customer_Order_Line
			 .Where(c => c.CustomerOrderID == customerOrderId && c.UserId == customerId && c.Customer_Order_LineID==customerOrderLineId);
			return await query.FirstOrDefaultAsync();

		}

		//gets all Customer Order lines for a specific order
		public async Task<Customer_Order_Line[]> GetOrderLinesByOrderAsync(int orderId)
		{
			IQueryable<Customer_Order_Line> query = _appDbContext.Customer_Order_Line.Where(c => c.CustomerOrderID == orderId);
			return await query.ToArrayAsync();
		}

		//Gets all customer order lines from every order customer "A" has ever made
		public async Task<Customer_Order_Line[]> GetOrderLinesByCustomerAsync(string customerId)
		{
			IQueryable<Customer_Order_Line> query = _appDbContext.Customer_Order_Line.Where(c => c.UserId == customerId);
			return await query.ToArrayAsync();
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

		//Gets one Supplier Order line  according to the concatenated ID
		public async Task<Supplier_OrderLine> GetSupplierOrderLineAsync(int supplierOrderId, int supplierId, int supplierOrderLineId) //int customerOrderLineID)
		{
			IQueryable<Supplier_OrderLine> query = _appDbContext.Supplier_OrderLine
			 .Where(c => c.SupplierID == supplierId && c.SupplierOrderID == supplierOrderId && c.Supplier_Order_LineID == supplierOrderLineId);
			return await query.FirstOrDefaultAsync();

		}

		//Gets all Supplier Order lines for a specific order
		public async Task<Supplier_OrderLine[]> GetSupplierOrderLinesByOrderAsync(int supOrderId)
		{
			IQueryable<Supplier_OrderLine> query = _appDbContext.Supplier_OrderLine.Where(c => c.SupplierOrderID == supOrderId);
			return await query.ToArrayAsync();
		}

		//Gets all Supplier order lines from every order Supplier "A" has ever made---------- This will help us to create a report for how much we have ordered from each Supplier
		public async Task<Supplier_OrderLine[]> GetSupplierOrderLinesBySupplierAsync(int supplierId)
		{
			IQueryable<Supplier_OrderLine> query = _appDbContext.Supplier_OrderLine.Where(c => c.SupplierID == supplierId);
			return await query.ToArrayAsync();
		}

        //----------------------------------------------------- STOCK TAKE --------------------------------
        public async Task<Stock_Take> GetStockTakeAsync(int stockTakeId)
        {
            IQueryable<Stock_Take> query = _appDbContext.Stock_Take.Where(st => st.StockTakeID == stockTakeId);
            return await query.FirstOrDefaultAsync();
        }

		//---------------------------------------------------------- SAVE CHANGES -----------------------------------------------------------
		//Never remove this line of code, code above the line above.
		public async Task<bool> SaveChangesAsync()
    {
      return await _appDbContext.SaveChangesAsync() > 0;
    }

    }

}






