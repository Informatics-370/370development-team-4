using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class AddedCustomerIDtotheCustomerOrderLinetable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          

        

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Order_Line",
                table: "Customer_Order_Line");

          
       

        

          

          

            migrationBuilder.AddColumn<int>(
                name: "CustomerID",
                table: "Customer_Order_Line",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Order_Line",
                table: "Customer_Order_Line",
                columns: new[] { "CustomerOrderID", "FixedProductID", "CustomProductID", "Customer_Order_LineID" });

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_CustomerID",
                table: "Customer_Order_Line",
                column: "CustomerID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Customer_CustomerID",
                table: "Customer_Order_Line",
                column: "CustomerID",
                principalTable: "Customer",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Customer_CustomerID",
                table: "Customer_Order_Line");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Order_Line",
                table: "Customer_Order_Line");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Order_Line_CustomerID",
                table: "Customer_Order_Line");

          

            migrationBuilder.DropColumn(
                name: "Customer_Order_LineID",
                table: "Customer_Order_Line");

            migrationBuilder.DropColumn(
                name: "CustomerID",
                table: "Customer_Order_Line");

          

        

          

       
        }
    }
}
