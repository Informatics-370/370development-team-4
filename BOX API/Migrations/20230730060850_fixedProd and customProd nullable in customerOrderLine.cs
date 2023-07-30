using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class fixedProdandcustomProdnullableincustomerOrderLine : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Custom_Product_CustomProductID",
                table: "Customer_Order_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Fixed_Product_FixedProductID",
                table: "Customer_Order_Line");

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductID",
                table: "Customer_Order_Line",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CustomProductID",
                table: "Customer_Order_Line",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Custom_Product_CustomProductID",
                table: "Customer_Order_Line",
                column: "CustomProductID",
                principalTable: "Custom_Product",
                principalColumn: "CustomProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Fixed_Product_FixedProductID",
                table: "Customer_Order_Line",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Custom_Product_CustomProductID",
                table: "Customer_Order_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Fixed_Product_FixedProductID",
                table: "Customer_Order_Line");

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductID",
                table: "Customer_Order_Line",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CustomProductID",
                table: "Customer_Order_Line",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Custom_Product_CustomProductID",
                table: "Customer_Order_Line",
                column: "CustomProductID",
                principalTable: "Custom_Product",
                principalColumn: "CustomProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Fixed_Product_FixedProductID",
                table: "Customer_Order_Line",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
