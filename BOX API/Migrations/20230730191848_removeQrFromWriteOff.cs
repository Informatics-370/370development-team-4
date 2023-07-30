using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class removeQrFromWriteOff : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_QR_Code_QRCodeID",
                table: "Write_Off");

            migrationBuilder.DropIndex(
                name: "IX_Write_Off_QRCodeID",
                table: "Write_Off");

            migrationBuilder.DropColumn(
                name: "QRCodeID",
                table: "Write_Off");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QRCodeID",
                table: "Write_Off",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Write_Off_QRCodeID",
                table: "Write_Off",
                column: "QRCodeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_QR_Code_QRCodeID",
                table: "Write_Off",
                column: "QRCodeID",
                principalTable: "QR_Code",
                principalColumn: "QRCodeID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
