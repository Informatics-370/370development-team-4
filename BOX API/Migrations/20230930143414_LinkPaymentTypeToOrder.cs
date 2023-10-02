using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class LinkPaymentTypeToOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Payment_Type_PaymentTypeID",
                table: "Payment");

            migrationBuilder.DropIndex(
                name: "IX_Payment_PaymentTypeID",
                table: "Payment");

            migrationBuilder.DropColumn(
                name: "PaymentTypeID",
                table: "Payment");

            migrationBuilder.AddColumn<int>(
                name: "PaymentTypeID",
                table: "Customer_Order",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_PaymentTypeID",
                table: "Customer_Order",
                column: "PaymentTypeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Payment_Type_PaymentTypeID",
                table: "Customer_Order",
                column: "PaymentTypeID",
                principalTable: "Payment_Type",
                principalColumn: "PaymentTypeID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Payment_Type_PaymentTypeID",
                table: "Customer_Order");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Order_PaymentTypeID",
                table: "Customer_Order");

            migrationBuilder.DropColumn(
                name: "PaymentTypeID",
                table: "Customer_Order");

            migrationBuilder.AddColumn<int>(
                name: "PaymentTypeID",
                table: "Payment",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Payment_PaymentTypeID",
                table: "Payment",
                column: "PaymentTypeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Payment_Type_PaymentTypeID",
                table: "Payment",
                column: "PaymentTypeID",
                principalTable: "Payment_Type",
                principalColumn: "PaymentTypeID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
