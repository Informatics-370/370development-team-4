using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class Addquoterequeststatustable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "QuoteRequestStatusID",
                table: "Quote_Request",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Quote_Request_Status",
                columns: table => new
                {
                    QuoteRequestStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quote_Request_Status", x => x.QuoteRequestStatusID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Request_QuoteRequestStatusID",
                table: "Quote_Request",
                column: "QuoteRequestStatusID");

            migrationBuilder.AddForeignKey(
                name: "FK_Quote_Request_Quote_Request_Status_QuoteRequestStatusID",
                table: "Quote_Request",
                column: "QuoteRequestStatusID",
                principalTable: "Quote_Request_Status",
                principalColumn: "QuoteRequestStatusID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quote_Request_Quote_Request_Status_QuoteRequestStatusID",
                table: "Quote_Request");

            migrationBuilder.DropTable(
                name: "Quote_Request_Status");

            migrationBuilder.DropIndex(
                name: "IX_Quote_Request_QuoteRequestStatusID",
                table: "Quote_Request");

            migrationBuilder.DropColumn(
                name: "QuoteRequestStatusID",
                table: "Quote_Request");
        }
    }
}
