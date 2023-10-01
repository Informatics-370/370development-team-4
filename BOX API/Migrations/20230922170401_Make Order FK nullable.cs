using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class MakeOrderFKnullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Customer_Order_CustomerOrderID",
                table: "Payment");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerOrderID",
                table: "Payment",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Customer_Order_CustomerOrderID",
                table: "Payment",
                column: "CustomerOrderID",
                principalTable: "Customer_Order",
                principalColumn: "CustomerOrderID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Customer_Order_CustomerOrderID",
                table: "Payment");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerOrderID",
                table: "Payment",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Customer_Order_CustomerOrderID",
                table: "Payment",
                column: "CustomerOrderID",
                principalTable: "Customer_Order",
                principalColumn: "CustomerOrderID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
