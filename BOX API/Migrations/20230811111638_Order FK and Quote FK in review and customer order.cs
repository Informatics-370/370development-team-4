using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class OrderFKandQuoteFKinreviewandcustomerorder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CustomerOrderID",
                table: "Customer_Review",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "QuoteID",
                table: "Customer_Order",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Review_CustomerOrderID",
                table: "Customer_Review",
                column: "CustomerOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_QuoteID",
                table: "Customer_Order",
                column: "QuoteID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Quote_QuoteID",
                table: "Customer_Order",
                column: "QuoteID",
                principalTable: "Quote",
                principalColumn: "QuoteID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Review_Customer_Order_CustomerOrderID",
                table: "Customer_Review",
                column: "CustomerOrderID",
                principalTable: "Customer_Order",
                principalColumn: "CustomerOrderID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Quote_QuoteID",
                table: "Customer_Order");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Review_Customer_Order_CustomerOrderID",
                table: "Customer_Review");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Review_CustomerOrderID",
                table: "Customer_Review");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Order_QuoteID",
                table: "Customer_Order");

            migrationBuilder.DropColumn(
                name: "CustomerOrderID",
                table: "Customer_Review");

            migrationBuilder.DropColumn(
                name: "QuoteID",
                table: "Customer_Order");
        }
    }
}
