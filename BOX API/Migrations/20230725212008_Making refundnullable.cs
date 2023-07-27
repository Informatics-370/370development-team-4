using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class Makingrefundnullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Customer_Refund_CustomerRefundID",
                table: "Customer_Order_Line");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerRefundID",
                table: "Customer_Order_Line",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Customer_Refund_CustomerRefundID",
                table: "Customer_Order_Line",
                column: "CustomerRefundID",
                principalTable: "Customer_Refund",
                principalColumn: "CustomerRefundID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Customer_Refund_CustomerRefundID",
                table: "Customer_Order_Line");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerRefundID",
                table: "Customer_Order_Line",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Customer_Refund_CustomerRefundID",
                table: "Customer_Order_Line",
                column: "CustomerRefundID",
                principalTable: "Customer_Refund",
                principalColumn: "CustomerRefundID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
