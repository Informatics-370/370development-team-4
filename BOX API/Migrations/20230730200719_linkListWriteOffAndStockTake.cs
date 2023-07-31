using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class linkListWriteOffAndStockTake : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Write_Off",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RawMaterialId",
                table: "Write_Off",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Write_Off_RawMaterialId",
                table: "Write_Off",
                column: "RawMaterialId");

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_Raw_Material_RawMaterialId",
                table: "Write_Off",
                column: "RawMaterialId",
                principalTable: "Raw_Material",
                principalColumn: "RawMaterialID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_Raw_Material_RawMaterialId",
                table: "Write_Off");

            migrationBuilder.DropIndex(
                name: "IX_Write_Off_RawMaterialId",
                table: "Write_Off");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Write_Off");

            migrationBuilder.DropColumn(
                name: "RawMaterialId",
                table: "Write_Off");
        }
    }
}
