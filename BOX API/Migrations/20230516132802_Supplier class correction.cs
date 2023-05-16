using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class Supplierclasscorrection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_Fixed_Product_UserID",
                table: "Supplier");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Supplier",
                newName: "FixedProductID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_UserID",
                table: "Supplier",
                newName: "IX_Supplier_FixedProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_Fixed_Product_FixedProductID",
                table: "Supplier",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_Fixed_Product_FixedProductID",
                table: "Supplier");

            migrationBuilder.RenameColumn(
                name: "FixedProductID",
                table: "Supplier",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_FixedProductID",
                table: "Supplier",
                newName: "IX_Supplier_UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_Fixed_Product_UserID",
                table: "Supplier",
                column: "UserID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
