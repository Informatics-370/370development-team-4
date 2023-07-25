using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class AddedProductCategorytoSizeUnits : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Size_Units");

            migrationBuilder.AddColumn<int>(
                name: "CategoryID",
                table: "Size_Units",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Size_Units_CategoryID",
                table: "Size_Units",
                column: "CategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Size_Units_Product_Category_CategoryID",
                table: "Size_Units",
                column: "CategoryID",
                principalTable: "Product_Category",
                principalColumn: "CategoryID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Size_Units_Product_Category_CategoryID",
                table: "Size_Units");

            migrationBuilder.DropIndex(
                name: "IX_Size_Units_CategoryID",
                table: "Size_Units");

            migrationBuilder.DropColumn(
                name: "CategoryID",
                table: "Size_Units");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Size_Units",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
