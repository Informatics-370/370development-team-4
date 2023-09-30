using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class addDeliveryTypeTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Delivery_Type",
                table: "Customer_Order");

            migrationBuilder.AddColumn<int>(
                name: "DeliveryTypeID",
                table: "Customer_Order",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Delivery_Type",
                columns: table => new
                {
                    DeliveryTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Delivery_Type", x => x.DeliveryTypeID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_DeliveryTypeID",
                table: "Customer_Order",
                column: "DeliveryTypeID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Delivery_Type_DeliveryTypeID",
                table: "Customer_Order",
                column: "DeliveryTypeID",
                principalTable: "Delivery_Type",
                principalColumn: "DeliveryTypeID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Delivery_Type_DeliveryTypeID",
                table: "Customer_Order");

            migrationBuilder.DropTable(
                name: "Delivery_Type");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Order_DeliveryTypeID",
                table: "Customer_Order");

            migrationBuilder.DropColumn(
                name: "DeliveryTypeID",
                table: "Customer_Order");

            migrationBuilder.AddColumn<string>(
                name: "Delivery_Type",
                table: "Customer_Order",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
