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
        //-----------------------QR CODE-----------------------
        Task<QR_Code> GetQRCodeAsync(int codeId);


        //---------------------------------------------------------- SUPPLIER -----------------------------------------------------------------
        Task<Supplier[]> GetAllSuppliersAsync();
        Task<Supplier> GetSupplierAsync(int supplierId);

        //-------------------------------------------------------- FIXED PRODUCT -----------------------------------------------------------------
        Task<Fixed_Product[]> GetAllFixedProductsAsync();
        Task<Fixed_Product> GetFixedProductAsync(int fixedProductId);
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
        Task<Estimate_Line> GetEstimateLineAsync(int estimateId, int customerId,int estimateLineId);
        Task<Estimate_Line[]> GetEstimateLinesByEstimateAsync(int estimateId);
        Task<Estimate_Line[]> GetEstimateLinesByCustomerAsync(int customerId);

        //------------------------------------------------CUSTOMER--------------------------------------------------
        Task<Customer> GetCustomerAsync(int customerId);

        //------------------------------------------------ADMIN------------------------------------------------------
        Task<Admin> GetAdminAsync(int adminId);

        //------------------------------------------------ROLE------------------------------------------------------
        Task<Role[]> GetAllRolesAsync();
        Task<Role> GetRoleAsync(int RoleId);

        //--------------------------- CREDIT APPLICATION STATUS --------------------------
        Task<Credit_Application_Status[]> GetAllAppStatusesAsync();
        Task<Credit_Application_Status> GetAppStatusAsync(int applicationId);
    }
}
