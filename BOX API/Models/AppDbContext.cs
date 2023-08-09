using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BOX.Models
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            //This sets the composite key for the Quote Line Entity and does the same for the remaining Associative entities
            modelBuilder.Entity<User_Role_Permission>()
     .HasKey(e => new { e.RoleId, e.UserPermissionID });

            modelBuilder.Entity<Category_Size_Variables>()
 .HasKey(e => new { e.CategoryID, e.SizeVariablesID });

        }

        public DbSet<Audit_Trail> Audit_Trail { get; set; }
        public DbSet<Cost_Price_Formula_Variables> cost_Price_Formula_Variables { get; set; }
        public DbSet<Credit_Application> Credit_Application { get; set; }
        public DbSet<Credit_Application_Status> Credit_Application_Status { get; set; }
        public DbSet<Custom_Product> Custom_Product { get; set; }
        public DbSet<Customer_Order_Status> Customer_Order_Status { get; set; }
        public DbSet<Customer_Return> Customer_Refund { get; set; }

        public DbSet<Customer_Return_Reason> Customer_Refund_Reason { get; set; }

        public DbSet<Customer_Review> Customer_Review { get; set; }

        public DbSet<Bulk_Discount> Bulk_Discount { get; set; }

        public DbSet<Quote> Quote { get; set; }
        public DbSet<Quote_Duration> Quote_Duration { get; set; }

        public DbSet<Quote_Line> Quote_Line { get; set; }

        public DbSet<Quote_Status> Quote_Status { get; set; }

        public DbSet<Fixed_Product> Fixed_Product { get; set; }

        public DbSet<Order_Delivery_Schedule> Order_Delivery_Schedule { get; set; }

        public DbSet<Payment> Payment { get; set; }

        public DbSet<Payment_Type> Payment_Type { get; set; }
        public DbSet<Price> Price { get; set; }
        public DbSet<Price_Match_File> Price_Match_File { get; set; }

        public DbSet<Product_Category> Product_Category { get; set; }

        public DbSet<Product_Item> Product_Item { get; set; }
        public DbSet<Quote_Request> Quote_Request { get; set; }
        public DbSet<Quote_Request_Line> Quote_Request_Line { get; set; }
        public DbSet<QR_Code> QR_Code { get; set; }
        public DbSet<Raw_Material> Raw_Material { get; set; }
        public DbSet<Reject_Reason> Reject_Reason { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<Size_Units> Size_Units { get; set; }
        public DbSet<Stock_Take> Stock_Take { get; set; }
        public DbSet<Supplier> Supplier { get; set; }
        public DbSet<Supplier_Order> Supplier_Order { get; set; }
        public DbSet<Supplier_OrderLine> Supplier_OrderLine { get; set; }
        public DbSet<Supplier_Return> Supplier_Return { get; set; }
        public DbSet<Title> Title { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<User_Permission> User_Permission { get; set; }
        public DbSet<VAT> VAT { get; set; }
        public DbSet<Customer_Order> Customer_Order { get; set; }

        public DbSet<Write_Off> Write_Off { get; set; }
        public DbSet<Write_Off_Reason> Write_Off_Reason { get; set; }
        public DbSet<Customer_Order_Line> Customer_Order_Line { get; set; }
        public DbSet<User_Role_Permission> User_Role_Permission { get; set; }
        public DbSet<Size_Variables> Size_Variables { get; set; }
        public DbSet<Category_Size_Variables> Category_Size_Variables { get; set; }

    }
}

