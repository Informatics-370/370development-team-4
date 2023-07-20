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

        public async Task UpdateFixedProductAsync(Fixed_Product fixedProduct)
        {
            // Update the fixed product entity in the data storage
            _appDbContext.Update(fixedProduct);

            await _appDbContext.SaveChangesAsync();
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

        //---------------------------------------------------------- SAVE CHANGES -----------------------------------------------------------
        //Never remove this line of code, code above the line above.
        public async Task<bool> SaveChangesAsync()
		{
			return await _appDbContext.SaveChangesAsync() > 0;
		}
	}
}






