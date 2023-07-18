using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class RemoveAdminFromEstimateLineAddConfirmedPriceToEstimate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Line_Admin_AdminID",
                table: "Estimate_Line");

            migrationBuilder.DropIndex(
                name: "IX_Estimate_Line_AdminID",
                table: "Estimate_Line");

            migrationBuilder.DropColumn(
                name: "AdminID",
                table: "Estimate_Line");

            migrationBuilder.DropColumn(
                name: "Confirmed_Unit_Price",
                table: "Estimate_Line");

            migrationBuilder.AddColumn<decimal>(
                name: "Confirmed_Total_Price",
                table: "Estimate",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Confirmed_Total_Price",
                table: "Estimate");

            migrationBuilder.AddColumn<int>(
                name: "AdminID",
                table: "Estimate_Line",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("Relational:ColumnOrder", 3);

            migrationBuilder.AddColumn<decimal>(
                name: "Confirmed_Unit_Price",
                table: "Estimate_Line",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_Line_AdminID",
                table: "Estimate_Line",
                column: "AdminID");

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Line_Admin_AdminID",
                table: "Estimate_Line",
                column: "AdminID",
                principalTable: "Admin",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
