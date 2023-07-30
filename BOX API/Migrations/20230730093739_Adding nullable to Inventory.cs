using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class AddingnullabletoInventory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Line_Custom_Product_CustomProductID",
                table: "Estimate_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Line_Fixed_Product_FixedProductID",
                table: "Estimate_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLine_Fixed_Product_FixedProductID",
                table: "Supplier_OrderLine");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLine_Raw_Material_RawMaterialID",
                table: "Supplier_OrderLine");

            migrationBuilder.AlterColumn<int>(
                name: "RawMaterialID",
                table: "Supplier_OrderLine",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductID",
                table: "Supplier_OrderLine",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductID",
                table: "Estimate_Line",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "CustomProductID",
                table: "Estimate_Line",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Line_Custom_Product_CustomProductID",
                table: "Estimate_Line",
                column: "CustomProductID",
                principalTable: "Custom_Product",
                principalColumn: "CustomProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Line_Fixed_Product_FixedProductID",
                table: "Estimate_Line",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLine_Fixed_Product_FixedProductID",
                table: "Supplier_OrderLine",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLine_Raw_Material_RawMaterialID",
                table: "Supplier_OrderLine",
                column: "RawMaterialID",
                principalTable: "Raw_Material",
                principalColumn: "RawMaterialID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Line_Custom_Product_CustomProductID",
                table: "Estimate_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Line_Fixed_Product_FixedProductID",
                table: "Estimate_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLine_Fixed_Product_FixedProductID",
                table: "Supplier_OrderLine");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLine_Raw_Material_RawMaterialID",
                table: "Supplier_OrderLine");

            migrationBuilder.AlterColumn<int>(
                name: "RawMaterialID",
                table: "Supplier_OrderLine",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductID",
                table: "Supplier_OrderLine",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductID",
                table: "Estimate_Line",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CustomProductID",
                table: "Estimate_Line",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Line_Custom_Product_CustomProductID",
                table: "Estimate_Line",
                column: "CustomProductID",
                principalTable: "Custom_Product",
                principalColumn: "CustomProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Line_Fixed_Product_FixedProductID",
                table: "Estimate_Line",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLine_Fixed_Product_FixedProductID",
                table: "Supplier_OrderLine",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLine_Raw_Material_RawMaterialID",
                table: "Supplier_OrderLine",
                column: "RawMaterialID",
                principalTable: "Raw_Material",
                principalColumn: "RawMaterialID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
