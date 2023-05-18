using System;

namespace BOX.Models
{
  public interface IRepository
  {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
    
        // For our basic CRUDS these are the standard functions we will be creating for the Models we scaffold.
        // Please do not forget to add these.
        Task<Size_Units[]> GetAllSizesAsync();
        Task<Size_Units> GetSizeAsync(int sizeId);
        //-----------------------PRODUCT CATEGORY-----------------------
        Task<Product_Category[]> GetAllCategoriesAsync();
        Task<Product_Category> GetCategoryAsync(int categoryId);
        //-----------------------PRODUCT ITEM-----------------------
        Task<Product_Item[]> GetAllItemsAsync();
        Task<Product_Item> GetItemAsync(int itemId);
    }
}
