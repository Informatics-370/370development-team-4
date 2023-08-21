using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class again : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RawMaterialId",
                table: "Write_Off",
                nullable: true,  // Make the column nullable
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductId",
                table: "Write_Off",
                nullable: true,  // Make the column nullable
                oldClrType: typeof(int),
                oldType: "int");
    }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RawMaterialId",
                table: "Write_Off",
                type: "int",
                nullable: false,  // Revert back to not nullable if needed
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FixedProductId",
                table: "Write_Off",
                type: "int",
                nullable: false,  // Revert back to not nullable if needed
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}
