using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class PermissionsRound2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Permission_Role_RoleId",
                table: "User_Role_Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Permission_User_Permission_UserPermissionID",
                table: "User_Role_Permission");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Role_Permission",
                table: "User_Role_Permission");

            migrationBuilder.RenameColumn(
                name: "UserPermissionID",
                table: "User_Role_Permission",
                newName: "PermissionId");

            migrationBuilder.RenameIndex(
                name: "IX_User_Role_Permission_UserPermissionID",
                table: "User_Role_Permission",
                newName: "IX_User_Role_Permission_PermissionId");

            migrationBuilder.AlterColumn<string>(
                name: "RoleId",
                table: "User_Role_Permission",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "User_Role_Permission",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Role_Permission",
                table: "User_Role_Permission",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_User_Role_Permission_RoleId",
                table: "User_Role_Permission",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_Permission_AspNetRoles_RoleId",
                table: "User_Role_Permission",
                column: "RoleId",
                principalTable: "AspNetRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_Permission_User_Permission_PermissionId",
                table: "User_Role_Permission",
                column: "PermissionId",
                principalTable: "User_Permission",
                principalColumn: "UserPermissionID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Permission_AspNetRoles_RoleId",
                table: "User_Role_Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Permission_User_Permission_PermissionId",
                table: "User_Role_Permission");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Role_Permission",
                table: "User_Role_Permission");

            migrationBuilder.DropIndex(
                name: "IX_User_Role_Permission_RoleId",
                table: "User_Role_Permission");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "User_Role_Permission");

            migrationBuilder.RenameColumn(
                name: "PermissionId",
                table: "User_Role_Permission",
                newName: "UserPermissionID");

            migrationBuilder.RenameIndex(
                name: "IX_User_Role_Permission_PermissionId",
                table: "User_Role_Permission",
                newName: "IX_User_Role_Permission_UserPermissionID");

            migrationBuilder.AlterColumn<int>(
                name: "RoleId",
                table: "User_Role_Permission",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Role_Permission",
                table: "User_Role_Permission",
                columns: new[] { "RoleId", "UserPermissionID" });

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_Permission_Role_RoleId",
                table: "User_Role_Permission",
                column: "RoleId",
                principalTable: "Role",
                principalColumn: "RoleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_Permission_User_Permission_UserPermissionID",
                table: "User_Role_Permission",
                column: "UserPermissionID",
                principalTable: "User_Permission",
                principalColumn: "UserPermissionID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
