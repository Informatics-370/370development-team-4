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
    public async Task<Size[]> GetAllSizesAsync()
    {
      IQueryable<Size> query = _appDbContext.Size;
      return await query.ToArrayAsync();
    }
    //Gets one Size according to the ID
    public async Task<Size> GetSizeAsync(int sizeId)
    {
      IQueryable<Size> query = _appDbContext.Size.Where(c => c.SizeID == sizeId);
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


