using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class newInitial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Audit_Trail",
                columns: table => new
                {
                    AuditTrailID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    User_FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Transaction_Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Critical_Data = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Critical_Data_Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Audit_Trail", x => x.AuditTrailID);
                });

            migrationBuilder.CreateTable(
                name: "Bulk_Discount",
                columns: table => new
                {
                    DiscountID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Percentage = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bulk_Discount", x => x.DiscountID);
                });

            migrationBuilder.CreateTable(
                name: "cost_Price_Formula_Variables",
                columns: table => new
                {
                    FormulaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Box_Factor = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Rate_Per_Ton = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Factory_Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Mark_Up = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cost_Price_Formula_Variables", x => x.FormulaID);
                });

            migrationBuilder.CreateTable(
                name: "Credit_Application_Status",
                columns: table => new
                {
                    CreditApplicationStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Credit_Application_Status", x => x.CreditApplicationStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Order_Status",
                columns: table => new
                {
                    CustomerOrderStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Order_Status", x => x.CustomerOrderStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Return_Reason",
                columns: table => new
                {
                    CustomerReturnReasonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Return_Reason", x => x.CustomerReturnReasonID);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Review",
                columns: table => new
                {
                    CustomerReviewID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Product_Rating = table.Column<int>(type: "int", nullable: false),
                    Comments = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Recommendation = table.Column<bool>(type: "bit", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Review", x => x.CustomerReviewID);
                });

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

            migrationBuilder.CreateTable(
                name: "Payment_Type",
                columns: table => new
                {
                    PaymentTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment_Type", x => x.PaymentTypeID);
                });

            migrationBuilder.CreateTable(
                name: "Product_Category",
                columns: table => new
                {
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product_Category", x => x.CategoryID);
                });

            migrationBuilder.CreateTable(
                name: "QR_Code",
                columns: table => new
                {
                    QRCodeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QR_Code_Photo = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QR_Code", x => x.QRCodeID);
                });

            migrationBuilder.CreateTable(
                name: "Quote_Duration",
                columns: table => new
                {
                    QuoteDurationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Duration = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quote_Duration", x => x.QuoteDurationID);
                });

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

            migrationBuilder.CreateTable(
                name: "Quote_Status",
                columns: table => new
                {
                    QuoteStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quote_Status", x => x.QuoteStatusID);
                });

            migrationBuilder.CreateTable(
                name: "RegisterMessages",
                columns: table => new
                {
                    messageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    message = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegisterMessages", x => x.messageId);
                });

            migrationBuilder.CreateTable(
                name: "Reject_Reason",
                columns: table => new
                {
                    RejectReasonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reject_Reason", x => x.RejectReasonID);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "Size_Variables",
                columns: table => new
                {
                    SizeVariablesID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Width = table.Column<bool>(type: "bit", nullable: false),
                    Height = table.Column<bool>(type: "bit", nullable: false),
                    Length = table.Column<bool>(type: "bit", nullable: false),
                    Weight = table.Column<bool>(type: "bit", nullable: false),
                    Volume = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Size_Variables", x => x.SizeVariablesID);
                });

            migrationBuilder.CreateTable(
                name: "Supplier",
                columns: table => new
                {
                    SupplierID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Contact_Number = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(75)", maxLength: 75, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier", x => x.SupplierID);
                });

            migrationBuilder.CreateTable(
                name: "Supplier_Return",
                columns: table => new
                {
                    SupplierReturnID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier_Return", x => x.SupplierReturnID);
                });

            migrationBuilder.CreateTable(
                name: "Title",
                columns: table => new
                {
                    TitleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Title", x => x.TitleID);
                });

            migrationBuilder.CreateTable(
                name: "User_Permission",
                columns: table => new
                {
                    UserPermissionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User_Permission", x => x.UserPermissionID);
                });

            migrationBuilder.CreateTable(
                name: "VAT",
                columns: table => new
                {
                    VatID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Percentage = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VAT", x => x.VatID);
                });

            migrationBuilder.CreateTable(
                name: "Write_Off_Reason",
                columns: table => new
                {
                    WriteOffReasonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Write_Off_Reason", x => x.WriteOffReasonID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Return",
                columns: table => new
                {
                    CustomerReturnID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerReturnReasonID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Return", x => x.CustomerReturnID);
                    table.ForeignKey(
                        name: "FK_Customer_Return_Customer_Return_Reason_CustomerReturnReasonID",
                        column: x => x.CustomerReturnReasonID,
                        principalTable: "Customer_Return_Reason",
                        principalColumn: "CustomerReturnReasonID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Product_Item",
                columns: table => new
                {
                    ItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(70)", maxLength: 70, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product_Item", x => x.ItemID);
                    table.ForeignKey(
                        name: "FK_Product_Item_Product_Category_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "Product_Category",
                        principalColumn: "CategoryID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Size_Units",
                columns: table => new
                {
                    SizeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    Width = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Height = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Length = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Volume = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Size_Units", x => x.SizeID);
                    table.ForeignKey(
                        name: "FK_Size_Units_Product_Category_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "Product_Category",
                        principalColumn: "CategoryID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Raw_Material",
                columns: table => new
                {
                    RawMaterialID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(70)", maxLength: 70, nullable: false),
                    QRCodeID = table.Column<int>(type: "int", nullable: false),
                    Quantity_On_Hand = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Raw_Material", x => x.RawMaterialID);
                    table.ForeignKey(
                        name: "FK_Raw_Material_QR_Code_QRCodeID",
                        column: x => x.QRCodeID,
                        principalTable: "QR_Code",
                        principalColumn: "QRCodeID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Category_Size_Variables",
                columns: table => new
                {
                    SizeVariablesID = table.Column<int>(type: "int", nullable: false),
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category_Size_Variables", x => new { x.CategoryID, x.SizeVariablesID });
                    table.ForeignKey(
                        name: "FK_Category_Size_Variables_Product_Category_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "Product_Category",
                        principalColumn: "CategoryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Category_Size_Variables_Size_Variables_SizeVariablesID",
                        column: x => x.SizeVariablesID,
                        principalTable: "Size_Variables",
                        principalColumn: "SizeVariablesID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Supplier_Order",
                columns: table => new
                {
                    SupplierOrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier_Order", x => x.SupplierOrderID);
                    table.ForeignKey(
                        name: "FK_Supplier_Order_Supplier_SupplierID",
                        column: x => x.SupplierID,
                        principalTable: "Supplier",
                        principalColumn: "SupplierID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    user_FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    user_LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    user_Address = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TitleID = table.Column<int>(type: "int", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUsers_Title_TitleID",
                        column: x => x.TitleID,
                        principalTable: "Title",
                        principalColumn: "TitleID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "User_Role_Permission",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PermissionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User_Role_Permission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_User_Role_Permission_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_User_Role_Permission_User_Permission_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "User_Permission",
                        principalColumn: "UserPermissionID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Custom_Product",
                columns: table => new
                {
                    CustomProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemID = table.Column<int>(type: "int", nullable: false),
                    FormulaID = table.Column<int>(type: "int", nullable: false),
                    Width = table.Column<int>(type: "int", nullable: false),
                    Height = table.Column<int>(type: "int", nullable: false),
                    Length = table.Column<int>(type: "int", nullable: false),
                    Label = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Sides = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Custom_Product", x => x.CustomProductID);
                    table.ForeignKey(
                        name: "FK_Custom_Product_cost_Price_Formula_Variables_FormulaID",
                        column: x => x.FormulaID,
                        principalTable: "cost_Price_Formula_Variables",
                        principalColumn: "FormulaID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Custom_Product_Product_Item_ItemID",
                        column: x => x.ItemID,
                        principalTable: "Product_Item",
                        principalColumn: "ItemID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Fixed_Product",
                columns: table => new
                {
                    FixedProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QRCodeID = table.Column<int>(type: "int", nullable: false),
                    ItemID = table.Column<int>(type: "int", nullable: false),
                    SizeID = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Product_Photo = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Quantity_On_Hand = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fixed_Product", x => x.FixedProductID);
                    table.ForeignKey(
                        name: "FK_Fixed_Product_Product_Item_ItemID",
                        column: x => x.ItemID,
                        principalTable: "Product_Item",
                        principalColumn: "ItemID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Fixed_Product_QR_Code_QRCodeID",
                        column: x => x.QRCodeID,
                        principalTable: "QR_Code",
                        principalColumn: "QRCodeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Fixed_Product_Size_Units_SizeID",
                        column: x => x.SizeID,
                        principalTable: "Size_Units",
                        principalColumn: "SizeID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Admin",
                columns: table => new
                {
                    AdminId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admin", x => x.AdminId);
                    table.ForeignKey(
                        name: "FK_Admin_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Credit_Application",
                columns: table => new
                {
                    creditApplicationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreditApplicationStatusID = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Application_Pdf = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Credit_Application", x => x.creditApplicationID);
                    table.ForeignKey(
                        name: "FK_Credit_Application_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Credit_Application_Credit_Application_Status_CreditApplicationStatusID",
                        column: x => x.CreditApplicationStatusID,
                        principalTable: "Credit_Application_Status",
                        principalColumn: "CreditApplicationStatusID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    EmployeeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.EmployeeId);
                    table.ForeignKey(
                        name: "FK_Employee_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Order_Delivery_Schedule",
                columns: table => new
                {
                    OrderDeliveryScheduleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order_Delivery_Schedule", x => x.OrderDeliveryScheduleID);
                    table.ForeignKey(
                        name: "FK_Order_Delivery_Schedule_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Quote_Request",
                columns: table => new
                {
                    QuoteRequestID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    QuoteRequestStatusID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quote_Request", x => x.QuoteRequestID);
                    table.ForeignKey(
                        name: "FK_Quote_Request_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Quote_Request_Quote_Request_Status_QuoteRequestStatusID",
                        column: x => x.QuoteRequestStatusID,
                        principalTable: "Quote_Request_Status",
                        principalColumn: "QuoteRequestStatusID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Stock_Take",
                columns: table => new
                {
                    StockTakeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stock_Take", x => x.StockTakeID);
                    table.ForeignKey(
                        name: "FK_Stock_Take_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Price",
                columns: table => new
                {
                    PriceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FixedProductID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Price", x => x.PriceID);
                    table.ForeignKey(
                        name: "FK_Price_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Supplier_OrderLine",
                columns: table => new
                {
                    Supplier_Order_LineID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierReturnID = table.Column<int>(type: "int", nullable: true),
                    SupplierOrderID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: true),
                    RawMaterialID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier_OrderLine", x => x.Supplier_Order_LineID);
                    table.ForeignKey(
                        name: "FK_Supplier_OrderLine_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID");
                    table.ForeignKey(
                        name: "FK_Supplier_OrderLine_Raw_Material_RawMaterialID",
                        column: x => x.RawMaterialID,
                        principalTable: "Raw_Material",
                        principalColumn: "RawMaterialID");
                    table.ForeignKey(
                        name: "FK_Supplier_OrderLine_Supplier_Order_SupplierOrderID",
                        column: x => x.SupplierOrderID,
                        principalTable: "Supplier_Order",
                        principalColumn: "SupplierOrderID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Supplier_OrderLine_Supplier_Return_SupplierReturnID",
                        column: x => x.SupplierReturnID,
                        principalTable: "Supplier_Return",
                        principalColumn: "SupplierReturnID");
                });

            migrationBuilder.CreateTable(
                name: "Customer",
                columns: table => new
                {
                    CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EmployeeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    isBusiness = table.Column<bool>(type: "bit", nullable: false),
                    vatNo = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    creditLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    creditBalance = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    discount = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer", x => x.CustomerId);
                    table.ForeignKey(
                        name: "FK_Customer_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "EmployeeId");
                });

            migrationBuilder.CreateTable(
                name: "Quote",
                columns: table => new
                {
                    QuoteID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuoteStatusID = table.Column<int>(type: "int", nullable: false),
                    QuoteDurationID = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    QuoteRequestID = table.Column<int>(type: "int", nullable: false),
                    RejectReasonID = table.Column<int>(type: "int", nullable: true),
                    Date_Generated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quote", x => x.QuoteID);
                    table.ForeignKey(
                        name: "FK_Quote_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Quote_Quote_Duration_QuoteDurationID",
                        column: x => x.QuoteDurationID,
                        principalTable: "Quote_Duration",
                        principalColumn: "QuoteDurationID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Quote_Quote_Request_QuoteRequestID",
                        column: x => x.QuoteRequestID,
                        principalTable: "Quote_Request",
                        principalColumn: "QuoteRequestID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Quote_Quote_Status_QuoteStatusID",
                        column: x => x.QuoteStatusID,
                        principalTable: "Quote_Status",
                        principalColumn: "QuoteStatusID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Quote_Reject_Reason_RejectReasonID",
                        column: x => x.RejectReasonID,
                        principalTable: "Reject_Reason",
                        principalColumn: "RejectReasonID");
                });

            migrationBuilder.CreateTable(
                name: "Quote_Request_Line",
                columns: table => new
                {
                    QuoteRequestLineID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuoteRequestID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: true),
                    CustomProductID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quote_Request_Line", x => x.QuoteRequestLineID);
                    table.ForeignKey(
                        name: "FK_Quote_Request_Line_Custom_Product_CustomProductID",
                        column: x => x.CustomProductID,
                        principalTable: "Custom_Product",
                        principalColumn: "CustomProductID");
                    table.ForeignKey(
                        name: "FK_Quote_Request_Line_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID");
                    table.ForeignKey(
                        name: "FK_Quote_Request_Line_Quote_Request_QuoteRequestID",
                        column: x => x.QuoteRequestID,
                        principalTable: "Quote_Request",
                        principalColumn: "QuoteRequestID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Write_Off",
                columns: table => new
                {
                    WriteOffID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WriteOffReasonID = table.Column<int>(type: "int", nullable: false),
                    StockTakeID = table.Column<int>(type: "int", nullable: false),
                    RawMaterialId = table.Column<int>(type: "int", nullable: true),
                    FixedProductId = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Write_Off", x => x.WriteOffID);
                    table.ForeignKey(
                        name: "FK_Write_Off_Fixed_Product_FixedProductId",
                        column: x => x.FixedProductId,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID");
                    table.ForeignKey(
                        name: "FK_Write_Off_Raw_Material_RawMaterialId",
                        column: x => x.RawMaterialId,
                        principalTable: "Raw_Material",
                        principalColumn: "RawMaterialID");
                    table.ForeignKey(
                        name: "FK_Write_Off_Stock_Take_StockTakeID",
                        column: x => x.StockTakeID,
                        principalTable: "Stock_Take",
                        principalColumn: "StockTakeID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Write_Off_Write_Off_Reason_WriteOffReasonID",
                        column: x => x.WriteOffReasonID,
                        principalTable: "Write_Off_Reason",
                        principalColumn: "WriteOffReasonID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Order",
                columns: table => new
                {
                    CustomerOrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuoteID = table.Column<int>(type: "int", nullable: false),
                    CustomerOrderStatusID = table.Column<int>(type: "int", nullable: false),
                    OrderDeliveryScheduleID = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Delivery_Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Delivery_Photo = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    DeliveryTypeID = table.Column<int>(type: "int", nullable: false),
                    PaymentTypeID = table.Column<int>(type: "int", nullable: false),
                    CustomerReviewID = table.Column<int>(type: "int", nullable: true),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QR_Code_Photo = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Order", x => x.CustomerOrderID);
                    table.ForeignKey(
                        name: "FK_Customer_Order_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Customer_Order_Status_CustomerOrderStatusID",
                        column: x => x.CustomerOrderStatusID,
                        principalTable: "Customer_Order_Status",
                        principalColumn: "CustomerOrderStatusID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Customer_Review_CustomerReviewID",
                        column: x => x.CustomerReviewID,
                        principalTable: "Customer_Review",
                        principalColumn: "CustomerReviewID");
                    table.ForeignKey(
                        name: "FK_Customer_Order_Delivery_Type_DeliveryTypeID",
                        column: x => x.DeliveryTypeID,
                        principalTable: "Delivery_Type",
                        principalColumn: "DeliveryTypeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Order_Delivery_Schedule_OrderDeliveryScheduleID",
                        column: x => x.OrderDeliveryScheduleID,
                        principalTable: "Order_Delivery_Schedule",
                        principalColumn: "OrderDeliveryScheduleID");
                    table.ForeignKey(
                        name: "FK_Customer_Order_Payment_Type_PaymentTypeID",
                        column: x => x.PaymentTypeID,
                        principalTable: "Payment_Type",
                        principalColumn: "PaymentTypeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Quote_QuoteID",
                        column: x => x.QuoteID,
                        principalTable: "Quote",
                        principalColumn: "QuoteID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Price_Match_File",
                columns: table => new
                {
                    PriceMatchFileID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuoteID = table.Column<int>(type: "int", nullable: false),
                    RejectReasonID = table.Column<int>(type: "int", nullable: false),
                    File = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Price_Match_File", x => x.PriceMatchFileID);
                    table.ForeignKey(
                        name: "FK_Price_Match_File_Quote_QuoteID",
                        column: x => x.QuoteID,
                        principalTable: "Quote",
                        principalColumn: "QuoteID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Price_Match_File_Reject_Reason_RejectReasonID",
                        column: x => x.RejectReasonID,
                        principalTable: "Reject_Reason",
                        principalColumn: "RejectReasonID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Quote_Line",
                columns: table => new
                {
                    QuoteID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: true),
                    QuoteLineID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomProductID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Confirmed_Unit_Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quote_Line", x => x.QuoteLineID);
                    table.ForeignKey(
                        name: "FK_Quote_Line_Custom_Product_CustomProductID",
                        column: x => x.CustomProductID,
                        principalTable: "Custom_Product",
                        principalColumn: "CustomProductID");
                    table.ForeignKey(
                        name: "FK_Quote_Line_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID");
                    table.ForeignKey(
                        name: "FK_Quote_Line_Quote_QuoteID",
                        column: x => x.QuoteID,
                        principalTable: "Quote",
                        principalColumn: "QuoteID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Order_Line",
                columns: table => new
                {
                    CustomerOrderLineID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerReturnID = table.Column<int>(type: "int", nullable: true),
                    CustomerOrderID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: true),
                    CustomProductID = table.Column<int>(type: "int", nullable: true),
                    OrderLineStatusID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Confirmed_Unit_Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Order_Line", x => x.CustomerOrderLineID);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_Custom_Product_CustomProductID",
                        column: x => x.CustomProductID,
                        principalTable: "Custom_Product",
                        principalColumn: "CustomProductID");
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_Customer_Order_CustomerOrderID",
                        column: x => x.CustomerOrderID,
                        principalTable: "Customer_Order",
                        principalColumn: "CustomerOrderID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_Customer_Return_CustomerReturnID",
                        column: x => x.CustomerReturnID,
                        principalTable: "Customer_Return",
                        principalColumn: "CustomerReturnID");
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID");
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_Order_Line_Status_OrderLineStatusID",
                        column: x => x.OrderLineStatusID,
                        principalTable: "Order_Line_Status",
                        principalColumn: "OrderLineStatusID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    PaymentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerOrderID = table.Column<int>(type: "int", nullable: true),
                    Date_And_Time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment", x => x.PaymentID);
                    table.ForeignKey(
                        name: "FK_Payment_Customer_Order_CustomerOrderID",
                        column: x => x.CustomerOrderID,
                        principalTable: "Customer_Order",
                        principalColumn: "CustomerOrderID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admin_UserId",
                table: "Admin",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_TitleID",
                table: "AspNetUsers",
                column: "TitleID");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Category_Size_Variables_SizeVariablesID",
                table: "Category_Size_Variables",
                column: "SizeVariablesID");

            migrationBuilder.CreateIndex(
                name: "IX_Credit_Application_CreditApplicationStatusID",
                table: "Credit_Application",
                column: "CreditApplicationStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Credit_Application_UserId",
                table: "Credit_Application",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Custom_Product_FormulaID",
                table: "Custom_Product",
                column: "FormulaID");

            migrationBuilder.CreateIndex(
                name: "IX_Custom_Product_ItemID",
                table: "Custom_Product",
                column: "ItemID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_EmployeeId",
                table: "Customer",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_UserId",
                table: "Customer",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_CustomerOrderStatusID",
                table: "Customer_Order",
                column: "CustomerOrderStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_CustomerReviewID",
                table: "Customer_Order",
                column: "CustomerReviewID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_DeliveryTypeID",
                table: "Customer_Order",
                column: "DeliveryTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_OrderDeliveryScheduleID",
                table: "Customer_Order",
                column: "OrderDeliveryScheduleID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_PaymentTypeID",
                table: "Customer_Order",
                column: "PaymentTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_QuoteID",
                table: "Customer_Order",
                column: "QuoteID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_UserId",
                table: "Customer_Order",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_CustomerOrderID",
                table: "Customer_Order_Line",
                column: "CustomerOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_CustomerReturnID",
                table: "Customer_Order_Line",
                column: "CustomerReturnID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_CustomProductID",
                table: "Customer_Order_Line",
                column: "CustomProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_FixedProductID",
                table: "Customer_Order_Line",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_OrderLineStatusID",
                table: "Customer_Order_Line",
                column: "OrderLineStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Return_CustomerReturnReasonID",
                table: "Customer_Return",
                column: "CustomerReturnReasonID");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_UserId",
                table: "Employee",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Fixed_Product_ItemID",
                table: "Fixed_Product",
                column: "ItemID");

            migrationBuilder.CreateIndex(
                name: "IX_Fixed_Product_QRCodeID",
                table: "Fixed_Product",
                column: "QRCodeID");

            migrationBuilder.CreateIndex(
                name: "IX_Fixed_Product_SizeID",
                table: "Fixed_Product",
                column: "SizeID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_Delivery_Schedule_UserId",
                table: "Order_Delivery_Schedule",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_CustomerOrderID",
                table: "Payment",
                column: "CustomerOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_Price_FixedProductID",
                table: "Price",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Price_Match_File_QuoteID",
                table: "Price_Match_File",
                column: "QuoteID");

            migrationBuilder.CreateIndex(
                name: "IX_Price_Match_File_RejectReasonID",
                table: "Price_Match_File",
                column: "RejectReasonID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Item_CategoryID",
                table: "Product_Item",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_QuoteDurationID",
                table: "Quote",
                column: "QuoteDurationID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_QuoteRequestID",
                table: "Quote",
                column: "QuoteRequestID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_QuoteStatusID",
                table: "Quote",
                column: "QuoteStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_RejectReasonID",
                table: "Quote",
                column: "RejectReasonID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_UserId",
                table: "Quote",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Line_CustomProductID",
                table: "Quote_Line",
                column: "CustomProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Line_FixedProductID",
                table: "Quote_Line",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Line_QuoteID",
                table: "Quote_Line",
                column: "QuoteID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Request_QuoteRequestStatusID",
                table: "Quote_Request",
                column: "QuoteRequestStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Request_UserId",
                table: "Quote_Request",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Request_Line_CustomProductID",
                table: "Quote_Request_Line",
                column: "CustomProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Request_Line_FixedProductID",
                table: "Quote_Request_Line",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Quote_Request_Line_QuoteRequestID",
                table: "Quote_Request_Line",
                column: "QuoteRequestID");

            migrationBuilder.CreateIndex(
                name: "IX_Raw_Material_QRCodeID",
                table: "Raw_Material",
                column: "QRCodeID");

            migrationBuilder.CreateIndex(
                name: "IX_Size_Units_CategoryID",
                table: "Size_Units",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Take_UserId",
                table: "Stock_Take",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_Order_SupplierID",
                table: "Supplier_Order",
                column: "SupplierID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLine_FixedProductID",
                table: "Supplier_OrderLine",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLine_RawMaterialID",
                table: "Supplier_OrderLine",
                column: "RawMaterialID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLine_SupplierOrderID",
                table: "Supplier_OrderLine",
                column: "SupplierOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLine_SupplierReturnID",
                table: "Supplier_OrderLine",
                column: "SupplierReturnID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Role_Permission_PermissionId",
                table: "User_Role_Permission",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Role_Permission_RoleId",
                table: "User_Role_Permission",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Off_FixedProductId",
                table: "Write_Off",
                column: "FixedProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Off_RawMaterialId",
                table: "Write_Off",
                column: "RawMaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Off_StockTakeID",
                table: "Write_Off",
                column: "StockTakeID");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Off_WriteOffReasonID",
                table: "Write_Off",
                column: "WriteOffReasonID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admin");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Audit_Trail");

            migrationBuilder.DropTable(
                name: "Bulk_Discount");

            migrationBuilder.DropTable(
                name: "Category_Size_Variables");

            migrationBuilder.DropTable(
                name: "Credit_Application");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "Customer_Order_Line");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "Price");

            migrationBuilder.DropTable(
                name: "Price_Match_File");

            migrationBuilder.DropTable(
                name: "Quote_Line");

            migrationBuilder.DropTable(
                name: "Quote_Request_Line");

            migrationBuilder.DropTable(
                name: "RegisterMessages");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "Supplier_OrderLine");

            migrationBuilder.DropTable(
                name: "User_Role_Permission");

            migrationBuilder.DropTable(
                name: "VAT");

            migrationBuilder.DropTable(
                name: "Write_Off");

            migrationBuilder.DropTable(
                name: "Size_Variables");

            migrationBuilder.DropTable(
                name: "Credit_Application_Status");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "Customer_Return");

            migrationBuilder.DropTable(
                name: "Order_Line_Status");

            migrationBuilder.DropTable(
                name: "Customer_Order");

            migrationBuilder.DropTable(
                name: "Custom_Product");

            migrationBuilder.DropTable(
                name: "Supplier_Order");

            migrationBuilder.DropTable(
                name: "Supplier_Return");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "User_Permission");

            migrationBuilder.DropTable(
                name: "Fixed_Product");

            migrationBuilder.DropTable(
                name: "Raw_Material");

            migrationBuilder.DropTable(
                name: "Stock_Take");

            migrationBuilder.DropTable(
                name: "Write_Off_Reason");

            migrationBuilder.DropTable(
                name: "Customer_Return_Reason");

            migrationBuilder.DropTable(
                name: "Customer_Order_Status");

            migrationBuilder.DropTable(
                name: "Customer_Review");

            migrationBuilder.DropTable(
                name: "Delivery_Type");

            migrationBuilder.DropTable(
                name: "Order_Delivery_Schedule");

            migrationBuilder.DropTable(
                name: "Payment_Type");

            migrationBuilder.DropTable(
                name: "Quote");

            migrationBuilder.DropTable(
                name: "cost_Price_Formula_Variables");

            migrationBuilder.DropTable(
                name: "Supplier");

            migrationBuilder.DropTable(
                name: "Product_Item");

            migrationBuilder.DropTable(
                name: "Size_Units");

            migrationBuilder.DropTable(
                name: "QR_Code");

            migrationBuilder.DropTable(
                name: "Quote_Duration");

            migrationBuilder.DropTable(
                name: "Quote_Request");

            migrationBuilder.DropTable(
                name: "Quote_Status");

            migrationBuilder.DropTable(
                name: "Reject_Reason");

            migrationBuilder.DropTable(
                name: "Product_Category");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Quote_Request_Status");

            migrationBuilder.DropTable(
                name: "Title");
        }
    }
}
