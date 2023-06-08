using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class removedQRcodefromrawmaterial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Raw_Material_QR_Code_QRCodeID",
                table: "Raw_Material");

            migrationBuilder.DropIndex(
                name: "IX_Raw_Material_QRCodeID",
                table: "Raw_Material");

            migrationBuilder.DropColumn(
                name: "QRCodeID",
                table: "Raw_Material");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QRCodeID",
                table: "Raw_Material",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Raw_Material_QRCodeID",
                table: "Raw_Material",
                column: "QRCodeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Raw_Material_QR_Code_QRCodeID",
                table: "Raw_Material",
                column: "QRCodeID",
                principalTable: "QR_Code",
                principalColumn: "QRCodeID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
