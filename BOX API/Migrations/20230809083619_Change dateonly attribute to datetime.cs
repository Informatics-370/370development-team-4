using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class Changedateonlyattributetodatetime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Price",
                columns: table => new
                {
                    PriceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FixedProductID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Price", x => x.PriceID);
                    table.ForeignKey(
                        name: "FK_Price_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Price_Match_File",
                columns: table => new
                {
                    PriceMatchFileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    File = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Price_Match_File", x => x.PriceMatchFileID);
                });

            migrationBuilder.CreateTable(
                name: "Quote_Request_Line",
                columns: table => new
                {
                    QuoteRequestLineID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuoteRequestID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: true),
                    CustomProductID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quote_Request_Line", x => x.QuoteRequestLineID);
                    table.ForeignKey(
                        name: "FK_Quote_Request_Line_Custom_Product_CustomProductID",
                        column: x => x.CustomProductID,
                        principalTable: "Custom_Product",
                        principalColumn: "CustomProductID");
                    table.ForeignKey(
                        name: "FK_Quote_Request_Line_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID");
                    table.ForeignKey(
                        name: "FK_Quote_Request_Line_Quote_Request_QuoteRequestID",
                        column: x => x.QuoteRequestID,
                        principalTable: "Quote_Request",
                        principalColumn: "QuoteRequestID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Price_FixedProductID",
                table: "Price",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Request_Line_CustomProductID",
                table: "Quote_Request_Line",
                column: "CustomProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Request_Line_FixedProductID",
                table: "Quote_Request_Line",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Request_Line_QuoteRequestID",
                table: "Quote_Request_Line",
                column: "QuoteRequestID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Price");

            migrationBuilder.DropTable(
                name: "Price_Match_File");

            migrationBuilder.DropTable(
                name: "Quote_Request_Line");
        }
    }
}
