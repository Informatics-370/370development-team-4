using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class AddedFixedProductToEstimateLine : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AlterColumn<int>(
                name: "AdminID",
                table: "Estimate_Line",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 3)
                .OldAnnotation("Relational:ColumnOrder", 2);

            migrationBuilder.AddColumn<int>(
                name: "FixedProductID",
                table: "Estimate_Line",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("Relational:ColumnOrder", 2);


            migrationBuilder.CreateIndex(
                name: "IX_Estimate_Line_FixedProductID",
                table: "Estimate_Line",
                column: "FixedProductID");

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Line_Fixed_Product_FixedProductID",
                table: "Estimate_Line",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

   
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Line_Fixed_Product_FixedProductID",
                table: "Estimate_Line");

    

            migrationBuilder.DropIndex(
                name: "IX_Estimate_Line_FixedProductID",
                table: "Estimate_Line");

       

            migrationBuilder.DropColumn(
                name: "FixedProductID",
                table: "Estimate_Line");


       

            migrationBuilder.AlterColumn<int>(
                name: "AdminID",
                table: "Estimate_Line",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("Relational:ColumnOrder", 2)
                .OldAnnotation("Relational:ColumnOrder", 3);


            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_Fixed_Product_FixedProductID",
                table: "Supplier",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
