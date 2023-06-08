using System;
using System.Threading.Tasks;

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
		Task<Raw_Material> GetRawMaterialAsync(int rawmaterialId);


        //------------------------------------------------------ ESTIMATE DURATION ------------------------------------------------------------
        Task<Estimate_Duration[]> GetAllEstimateDurationsAsync();
		Task<Estimate_Duration> GetEstimateDurationAsync(int estimatedurationId);


        //---------------------------------------------------------- SUPPLIER -----------------------------------------------------------------
        Task<Supplier[]> GetAllSuppliersAsync();
        Task<Supplier> GetSupplierAsync(int supplierId);

        //-------------------------------------------------------- FIXED PRODUCT -----------------------------------------------------------------
        Task<Fixed_Product[]> GetAllFixedProductsAsync();
        Task<Fixed_Product> GetFixedProductAsync(int fixedProductId);
        Task UpdateFixedProductAsync(Fixed_Product fixedProduct);
    }
}
