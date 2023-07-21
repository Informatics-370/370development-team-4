using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class QuantityAttributeInFixedPAndRawMat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity_On_Hand",
                table: "Raw_Material",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Quantity_On_Hand",
                table: "Fixed_Product",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity_On_Hand",
                table: "Raw_Material");

            migrationBuilder.DropColumn(
                name: "Quantity_On_Hand",
                table: "Fixed_Product");
        }
    }
}
