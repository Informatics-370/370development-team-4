using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class Schematicchanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FixedProductSize");

            migrationBuilder.DropTable(
                name: "Size");

            migrationBuilder.AddColumn<int>(
                name: "SizeID",
                table: "Fixed_Product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Size_Units",
                columns: table => new
                {
                    SizeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Width = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Height = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Length = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Volume = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Size_Units", x => x.SizeID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Fixed_Product_SizeID",
                table: "Fixed_Product",
                column: "SizeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Fixed_Product_Size_Units_SizeID",
                table: "Fixed_Product",
                column: "SizeID",
                principalTable: "Size_Units",
                principalColumn: "SizeID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Fixed_Product_Size_Units_SizeID",
                table: "Fixed_Product");

            migrationBuilder.DropTable(
                name: "Size_Units");

            migrationBuilder.DropIndex(
                name: "IX_Fixed_Product_SizeID",
                table: "Fixed_Product");

            migrationBuilder.DropColumn(
                name: "SizeID",
                table: "Fixed_Product");

            migrationBuilder.CreateTable(
                name: "Size",
                columns: table => new
                {
                    SizeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Height = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Length = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Volume = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Width = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Size", x => x.SizeID);
                });

            migrationBuilder.CreateTable(
                name: "FixedProductSize",
                columns: table => new
                {
                    SizeID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixedProductSize", x => new { x.SizeID, x.FixedProductID });
                    table.ForeignKey(
                        name: "FK_FixedProductSize_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FixedProductSize_Size_SizeID",
                        column: x => x.SizeID,
                        principalTable: "Size",
                        principalColumn: "SizeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FixedProductSize_FixedProductID",
                table: "FixedProductSize",
                column: "FixedProductID");
        }
    }
}
