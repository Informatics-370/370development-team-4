using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class RemovedFPinSupplier : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_Fixed_Product_FixedProductID",
                table: "Supplier");

            migrationBuilder.DropIndex(
                name: "IX_Supplier_FixedProductID",
                table: "Supplier");

            migrationBuilder.DropColumn(
                name: "FixedProductID",
                table: "Supplier");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FixedProductID",
                table: "Supplier",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_FixedProductID",
                table: "Supplier",
                column: "FixedProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_Fixed_Product_FixedProductID",
                table: "Supplier",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
