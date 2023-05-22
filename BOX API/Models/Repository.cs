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

        //Allows create functionality -- Never delete this
        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }

        //Allows delete functionality -- Never delete this
        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }
      
        //Gets all Sizes
        public async Task<Size_Units[]> GetAllSizesAsync()
        {
            IQueryable<Size_Units> query = _appDbContext.Size_Units;
            return await query.ToArrayAsync();
        }
        //Gets one Size according to the ID
        public async Task<Size_Units> GetSizeAsync(int sizeId)
        {
            IQueryable<Size_Units> query = _appDbContext.Size_Units.Where(c => c.SizeID == sizeId);
            return await query.FirstOrDefaultAsync();
        }

        //-----------------------PRODUCT CATEGORY-----------------------
        public async Task<Product_Category[]> GetAllCategoriesAsync() //Gets all categories
        {
            IQueryable<Product_Category> query = _appDbContext.Product_Category;
            return await query.ToArrayAsync();
        }

        public async Task<Product_Category> GetCategoryAsync(int categoryId) //Get category by ID
        {
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
            IQueryable<Category_Size_Variables> query = _appDbContext.Category_Size_Variables.Where(c => c.CategoryID == catId);
                return await query.FirstOrDefaultAsync();
        }

        //-----------------------PRODUCT ITEM-----------------------
        public async Task<Product_Item[]> GetAllItemsAsync() //Gets all items
        {
            IQueryable<Product_Item> query = _appDbContext.Product_Item;
            return await query.ToArrayAsync();
        }

        public async Task<Product_Item> GetItemAsync(int itemId) //Get item by ID
        {
            IQueryable<Product_Item> query = _appDbContext.Product_Item.Where(c => c.ItemID == itemId);
            return await query.FirstOrDefaultAsync();
        }

        //------------------------------Write OFF Reason------------------------------------------

        //Gets all Write Off Reasons
        public async Task<Write_Off_Reason[]> GetAllWriteOffReasonsAsync()
        {
	        IQueryable<Write_Off_Reason> query = _appDbContext.Write_Off_Reason;
	        return await query.ToArrayAsync();
        }
        //Gets one Size according to the ID
        public async Task<Write_Off_Reason> GetWriteOffReasonAsync(int writeoffreasonId)
        {
	        IQueryable<Write_Off_Reason> query = _appDbContext.Write_Off_Reason.Where(c => c.WriteOffReasonID == writeoffreasonId);
	        return await query.FirstOrDefaultAsync();
        }

        //------------------------------Customer Refund Reason------------------------------------------
        public async Task<Customer_Refund_Reason[]> GetAllCustomerRefundfReasonsAsync()
        {
	        IQueryable<Customer_Refund_Reason> query = _appDbContext.Customer_Refund_Reason;
	        return await query.ToArrayAsync();
        }
        //Gets one Customer Refund Reason according to the ID
        public async Task<Customer_Refund_Reason> GetCustomerRefundReasonAsync(int customerrefundreasonId)
        {
	        IQueryable<Customer_Refund_Reason> query = _appDbContext.Customer_Refund_Reason.Where(c => c.CustomerRefundReasonID == customerrefundreasonId);
	        return await query.FirstOrDefaultAsync();
        }

		// ------------------------------ RAW MATERIAL -------------------------------------------------
		public async Task<Raw_Material[]> GetAllRawMaterialsAsync()
		{
			IQueryable<Raw_Material> query = _appDbContext.Raw_Material;
			return await query.ToArrayAsync();
		}

		public async Task<Raw_Material> GetRawMaterialAsync(int rawMaterialId)
		{
			IQueryable<Raw_Material> query = _appDbContext.Raw_Material.Where(rm => rm.RawMaterialID == rawMaterialId);
			return await query.FirstOrDefaultAsync();
		}

		// ------------------------------ VAT -------------------------------------------
		public async Task<VAT[]> GetAllVatAsync()
		{
			IQueryable<VAT> query = _appDbContext.VAT;
			return await query.ToArrayAsync();
		}

		public async Task<VAT> GetVatAsync(int vatId)
		{
			IQueryable<VAT> query = _appDbContext.VAT.Where(v => v.VatID == vatId);
			return await query.FirstOrDefaultAsync();
		}

		// ------------------------------ Supplier -------------------------------------------
		public async Task<Supplier[]> GetAllSuppliersAsync()
		{
			IQueryable<Supplier> query = _appDbContext.Supplier;
			return await query.ToArrayAsync();
		}

		public async Task<Supplier> GetSupplierAsync(int supplierId)
		{
			IQueryable<Supplier> query = _appDbContext.Supplier.Where(s => s.SupplierID == supplierId);
			return await query.FirstOrDefaultAsync();
		}

		//=================================================================================
		//Never remove this line of code, code above the line above.
		public async Task<bool> SaveChangesAsync()
		{
			return await _appDbContext.SaveChangesAsync() > 0;
		}
	}
}






