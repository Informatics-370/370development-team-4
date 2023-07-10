//namespace BOX.Models
//{
//  public class DBSeeder
//  {
//    private readonly AppDbContext _context;

//    public DBSeeder(AppDbContext context)
//    {
//      _context = context;
//    }

//    public void SeedData(AppDbContext dbContext)
//    {
//      // Check if there are any existing records in the Product_Item table
//      if (!_context.Product_Item.Any())
//      {
//        // Get all categories and items from the DBSeeder class
//        var categories = GetAllCategories();
//        var items = GetAllItems();

//        // Add categories and items to the context and save changes
//        _context.Product_Category.AddRange(categories);
//        _context.Product_Item.AddRange(items);

//        _context.SaveChanges();
//      }
//    }

//    public List<Product_Item> GetAllItems()
//    {
//      var productItems = new List<Product_Item>();

//      // Create seed data item 1
//      var productItem1 = new Product_Item
//      {
//        ItemID = 0,
//        CategoryID = 1,  // Assuming you have a Category with ID 1
//        Description = "Product item 1 description"
//      };
//      productItems.Add(productItem1);

//      // Create seed data item 2
//      var productItem2 = new Product_Item
//      {
//        ItemID = 0,
//        CategoryID = 2,  // Assuming you have a Category with ID 2
//        Description = "Product item 2 description"
//      };
//      productItems.Add(productItem2);

//      // Add more seed data items as needed...

//      return productItems;
//    }

//    public List<Product_Category> GetAllCategories()
//    {
//      var categories = new List<Product_Category>();

//      // Create seed category 1
//      var category1 = new Product_Category
//      {
//        CategoryID = 0,
//        Description = "Category 1"
//      };
//      categories.Add(category1);

//      // Create seed category 2
//      var category2 = new Product_Category
//      {
//        CategoryID = 0,
//        Description = "Category 2"
//      };
//      categories.Add(category2);

//      // Add more seed categories as needed...

//      return categories;
//    }
//  }
//}
