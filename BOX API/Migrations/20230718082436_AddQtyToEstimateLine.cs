using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class AddQtyToEstimateLine : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Estimate_Line",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Estimate_Line");
        }
    }
}
