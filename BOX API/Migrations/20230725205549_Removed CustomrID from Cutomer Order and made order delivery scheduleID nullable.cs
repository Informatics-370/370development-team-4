using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class RemovedCustomrIDfromCutomerOrderandmadeorderdeliveryscheduleIDnullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Customer_CustomerID",
                table: "Customer_Order");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Order_Delivery_Schedule_OrderDeliveryScheduleID",
                table: "Customer_Order");

            migrationBuilder.DropIndex(
                name: "IX_Customer_Order_CustomerID",
                table: "Customer_Order");

            migrationBuilder.DropColumn(
                name: "CustomerID",
                table: "Customer_Order");

            migrationBuilder.AlterColumn<int>(
                name: "OrderDeliveryScheduleID",
                table: "Customer_Order",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

        

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Order_Delivery_Schedule_OrderDeliveryScheduleID",
                table: "Customer_Order",
                column: "OrderDeliveryScheduleID",
                principalTable: "Order_Delivery_Schedule",
                principalColumn: "OrderDeliveryScheduleID");

          
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Order_Delivery_Schedule_OrderDeliveryScheduleID",
                table: "Customer_Order");

      



            migrationBuilder.AlterColumn<int>(
                name: "OrderDeliveryScheduleID",
                table: "Customer_Order",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomerID",
                table: "Customer_Order",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_CustomerID",
                table: "Customer_Order",
                column: "CustomerID");

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Customer_CustomerID",
                table: "Customer_Order",
                column: "CustomerID",
                principalTable: "Customer",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Order_Delivery_Schedule_OrderDeliveryScheduleID",
                table: "Customer_Order",
                column: "OrderDeliveryScheduleID",
                principalTable: "Order_Delivery_Schedule",
                principalColumn: "OrderDeliveryScheduleID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
