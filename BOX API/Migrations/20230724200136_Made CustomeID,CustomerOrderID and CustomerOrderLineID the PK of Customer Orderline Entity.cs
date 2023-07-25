using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class MadeCustomeIDCustomerOrderIDandCustomerOrderLineIDthePKofCustomerOrderlineEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Order_Line",
                table: "Customer_Order_Line");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Order_Line_CustomerID",
                table: "Customer_Order_Line");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Order_Line",
                table: "Customer_Order_Line",
                columns: new[] { "CustomerID", "CustomerOrderID", "Customer_Order_LineID" });

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_CustomerOrderID",
                table: "Customer_Order_Line",
                column: "CustomerOrderID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Order_Line",
                table: "Customer_Order_Line");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Order_Line_CustomerOrderID",
                table: "Customer_Order_Line");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Order_Line",
                table: "Customer_Order_Line",
                columns: new[] { "CustomerOrderID", "FixedProductID", "CustomProductID", "Customer_Order_LineID" });

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_CustomerID",
                table: "Customer_Order_Line",
                column: "CustomerID");
        }
    }
}
