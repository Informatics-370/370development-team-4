using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class Just : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_Fixed_Product_FixedProductId",
                table: "Write_Off");

            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_Raw_Material_RawMaterialId",
                table: "Write_Off");

            migrationBuilder.AlterColumn<int>(
                name: "RawMaterialId",
                table: "Write_Off",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductId",
                table: "Write_Off",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_Fixed_Product_FixedProductId",
                table: "Write_Off",
                column: "FixedProductId",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_Raw_Material_RawMaterialId",
                table: "Write_Off",
                column: "RawMaterialId",
                principalTable: "Raw_Material",
                principalColumn: "RawMaterialID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_Fixed_Product_FixedProductId",
                table: "Write_Off");

            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_Raw_Material_RawMaterialId",
                table: "Write_Off");

            migrationBuilder.AlterColumn<int>(
                name: "RawMaterialId",
                table: "Write_Off",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductId",
                table: "Write_Off",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_Fixed_Product_FixedProductId",
                table: "Write_Off",
                column: "FixedProductId",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_Raw_Material_RawMaterialId",
                table: "Write_Off",
                column: "RawMaterialId",
                principalTable: "Raw_Material",
                principalColumn: "RawMaterialID");
        }
    }
}
