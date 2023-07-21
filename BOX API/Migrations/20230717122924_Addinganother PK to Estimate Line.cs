using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class AddinganotherPKtoEstimateLine : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimate_Line",
                table: "Estimate_Line");

            migrationBuilder.AddColumn<int>(
                name: "EstimateLineID",
                table: "Estimate_Line",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimate_Line",
                table: "Estimate_Line",
                columns: new[] { "CustomerID", "EstimateID", "EstimateLineID" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimate_Line",
                table: "Estimate_Line");

            migrationBuilder.DropColumn(
                name: "EstimateLineID",
                table: "Estimate_Line");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimate_Line",
                table: "Estimate_Line",
                columns: new[] { "CustomerID", "EstimateID" });
        }
    }
}
