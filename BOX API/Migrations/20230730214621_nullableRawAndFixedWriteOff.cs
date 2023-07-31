using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class nullableRawAndFixedWriteOff : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FixedProductId",
                table: "Write_Off",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Write_Off_FixedProductId",
                table: "Write_Off",
                column: "FixedProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_Fixed_Product_FixedProductId",
                table: "Write_Off",
                column: "FixedProductId",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_Fixed_Product_FixedProductId",
                table: "Write_Off");

            migrationBuilder.DropIndex(
                name: "IX_Write_Off_FixedProductId",
                table: "Write_Off");

            migrationBuilder.DropColumn(
                name: "FixedProductId",
                table: "Write_Off");
        }
    }
}
