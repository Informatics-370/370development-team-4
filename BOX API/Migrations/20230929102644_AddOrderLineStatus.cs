using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class AddOrderLineStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OrderLineStatusID",
                table: "Customer_Order_Line",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Order_Line_Status",
                columns: table => new
                {
                    OrderLineStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order_Line_Status", x => x.OrderLineStatusID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_OrderLineStatusID",
                table: "Customer_Order_Line",
                column: "OrderLineStatusID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Order_Line_Status_OrderLineStatusID",
                table: "Customer_Order_Line",
                column: "OrderLineStatusID",
                principalTable: "Order_Line_Status",
                principalColumn: "OrderLineStatusID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Order_Line_Status_OrderLineStatusID",
                table: "Customer_Order_Line");

            migrationBuilder.DropTable(
                name: "Order_Line_Status");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Order_Line_OrderLineStatusID",
                table: "Customer_Order_Line");

            migrationBuilder.DropColumn(
                name: "OrderLineStatusID",
                table: "Customer_Order_Line");
        }
    }
}
