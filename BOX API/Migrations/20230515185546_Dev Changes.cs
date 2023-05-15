using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class DevChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Fixed_Product_Size_SizeID",
                table: "Fixed_Product");

            migrationBuilder.DropTable(
                name: "Fixed_Price");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FixedProductSize",
                table: "FixedProductSize");

            migrationBuilder.DropIndex(
                name: "IX_FixedProductSize_SizeID",
                table: "FixedProductSize");

            migrationBuilder.DropIndex(
                name: "IX_Fixed_Product_SizeID",
                table: "Fixed_Product");

            migrationBuilder.DropColumn(
                name: "FixedProductSizeID",
                table: "FixedProductSize");

            migrationBuilder.DropColumn(
                name: "SizeID",
                table: "Fixed_Product");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Fixed_Product",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddPrimaryKey(
                name: "PK_FixedProductSize",
                table: "FixedProductSize",
                columns: new[] { "SizeID", "FixedProductID" });

            migrationBuilder.CreateTable(
                name: "Size_Variables",
                columns: table => new
                {
                    SizeVariablesID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Width = table.Column<bool>(type: "bit", nullable: false),
                    Height = table.Column<bool>(type: "bit", nullable: false),
                    Length = table.Column<bool>(type: "bit", nullable: false),
                    Weight = table.Column<bool>(type: "bit", nullable: false),
                    Volume = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Size_Variables", x => x.SizeVariablesID);
                });

            migrationBuilder.CreateTable(
                name: "Category_Size_Variables",
                columns: table => new
                {
                    SizeVariablesID = table.Column<int>(type: "int", nullable: false),
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category_Size_Variables", x => new { x.CategoryID, x.SizeVariablesID });
                    table.ForeignKey(
                        name: "FK_Category_Size_Variables_Product_Category_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "Product_Category",
                        principalColumn: "CategoryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Category_Size_Variables_Size_Variables_SizeVariablesID",
                        column: x => x.SizeVariablesID,
                        principalTable: "Size_Variables",
                        principalColumn: "SizeVariablesID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Category_Size_Variables_SizeVariablesID",
                table: "Category_Size_Variables",
                column: "SizeVariablesID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Category_Size_Variables");

            migrationBuilder.DropTable(
                name: "Size_Variables");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FixedProductSize",
                table: "FixedProductSize");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Fixed_Product");

            migrationBuilder.AddColumn<int>(
                name: "FixedProductSizeID",
                table: "FixedProductSize",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "SizeID",
                table: "Fixed_Product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_FixedProductSize",
                table: "FixedProductSize",
                column: "FixedProductSizeID");

            migrationBuilder.CreateTable(
                name: "Fixed_Price",
                columns: table => new
                {
                    PriceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Date = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fixed_Price", x => x.PriceID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FixedProductSize_SizeID",
                table: "FixedProductSize",
                column: "SizeID");

            migrationBuilder.CreateIndex(
                name: "IX_Fixed_Product_SizeID",
                table: "Fixed_Product",
                column: "SizeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Fixed_Product_Size_SizeID",
                table: "Fixed_Product",
                column: "SizeID",
                principalTable: "Size",
                principalColumn: "SizeID",
                onDelete: ReferentialAction.NoAction
        }
    }
}
