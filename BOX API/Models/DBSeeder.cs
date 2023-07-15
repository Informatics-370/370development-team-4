//Kuziwa: 15 July, unsuccessfully attempted to get the seeding logic to work, I will have to revisit it at another stage.

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
//        // Get all estimate statuses from the DBSeeder class
//        var estimatestatuses = GetAllEstimateStatuses();

//        // Add categories and items to the context and save changes
//        _context.Estimate_Status.AddRange(estimatestatuses);

//        _context.SaveChanges();
//      }
//    }

//    public List<Estimate_Status> GetAllEstimateStatuses()
//    {
//      var estimate_Statuses = new List<Estimate_Status>();

//      // Create seed data item 1
//      var estimatestatus1 = new Estimate_Status
//      {
//        EstimateStatusID = 0,
//        Description = "Pending Review"
//      };
//      estimate_Statuses.Add(estimatestatus1);

//      // Create seed data item 2
//      var estimatestatus2 = new Estimate_Status
//      {
//        EstimateStatusID = 1,
//        Description = "Reviewed"
//      };
//      estimate_Statuses.Add(estimatestatus2);

//      var estimatestatus3 = new Estimate_Status
//      {
//        EstimateStatusID = 2,
//        Description = "Expired"
//      };
//      estimate_Statuses.Add(estimatestatus3);

//      var estimatestatus4 = new Estimate_Status
//      {
//        EstimateStatusID = 3,
//        Description = "Cancelled"
//      };
//      estimate_Statuses.Add(estimatestatus4);

//      var estimatestatus5 = new Estimate_Status
//      {
//        EstimateStatusID = 4,
//        Description = "Accepted"
//      };
//      estimate_Statuses.Add(estimatestatus5);

//      var estimatestatus6 = new Estimate_Status
//      {
//        EstimateStatusID = 5,
//        Description = "Rejected"
//      };
//      estimate_Statuses.Add(estimatestatus6);


//      return estimate_Statuses;
//    }

//  }
//}
