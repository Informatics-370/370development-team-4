using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class EmpIdInCustNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "EmployeeId",
                table: "Customer", 
                nullable: true,     
                oldNullable: false, 
                type: "nvarchar(max)",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
