using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class nullRawWriteOff : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RawMaterialId",
                table: "Write_Off",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
            name: "RawMaterialId",
            table: "Write_Off",
            nullable: false,  // Set RawMaterialId to non-nullable
            oldClrType: typeof(int),
            oldType: "int");

        }
    }
}
