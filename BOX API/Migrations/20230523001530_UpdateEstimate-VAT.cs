using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class UpdateEstimateVAT : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "VAT");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Date",
                table: "VAT",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
