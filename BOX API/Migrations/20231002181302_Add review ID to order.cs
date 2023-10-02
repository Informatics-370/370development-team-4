using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class AddreviewIDtoorder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CustomerReviewID",
                table: "Customer_Order",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_CustomerReviewID",
                table: "Customer_Order",
                column: "CustomerReviewID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Customer_Review_CustomerReviewID",
                table: "Customer_Order",
                column: "CustomerReviewID",
                principalTable: "Customer_Review",
                principalColumn: "CustomerReviewID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Customer_Review_CustomerReviewID",
                table: "Customer_Order");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Order_CustomerReviewID",
                table: "Customer_Order");

            migrationBuilder.DropColumn(
                name: "CustomerReviewID",
                table: "Customer_Order");
        }
    }
}
