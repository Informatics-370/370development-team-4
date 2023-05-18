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

    //-------------------------PRODUCT CATEGORY-------------------------
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


    //------------------------------------------------------------------------------------------------------------------------------------------------------------

        //Never remove this line of code, code above the line above.
      public async Task<bool> SaveChangesAsync()
      {
        return await _appDbContext.SaveChangesAsync() > 0;
      }
    }
  }


