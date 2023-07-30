using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class deleteMigrations : Migration
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
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    user_FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    user_LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    user_Address = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    title = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
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
                });

            migrationBuilder.CreateTable(
                name: "Audit_Trail",
                columns: table => new
                {
                    AuditTrailID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Action = table.Column<bool>(type: "bit", nullable: false),
                    Item_Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Item_Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Audit_Trail", x => x.AuditTrailID);
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
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Order_Status", x => x.CustomerOrderStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Refund_Reason",
                columns: table => new
                {
                    CustomerRefundReasonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Refund_Reason", x => x.CustomerRefundReasonID);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Review",
                columns: table => new
                {
                    CustomerReviewID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Product_Rating = table.Column<int>(type: "int", nullable: false),
                    Comments = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Recommendation = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Review", x => x.CustomerReviewID);
                });

            migrationBuilder.CreateTable(
                name: "Discount",
                columns: table => new
                {
                    DiscountID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Percentage = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Discount", x => x.DiscountID);
                });

            migrationBuilder.CreateTable(
                name: "Estimate_Duration",
                columns: table => new
                {
                    EstimateDurationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Duration = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estimate_Duration", x => x.EstimateDurationID);
                });

            migrationBuilder.CreateTable(
                name: "Estimate_Status",
                columns: table => new
                {
                    EstimateStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estimate_Status", x => x.EstimateStatusID);
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
                name: "Supplier_Order",
                columns: table => new
                {
                    SupplierOrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier_Order", x => x.SupplierOrderID);
                });

            migrationBuilder.CreateTable(
                name: "Supplier_Return",
                columns: table => new
                {
                    SupplierReturnID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier_Return", x => x.SupplierReturnID);
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
                    Percentage = table.Column<int>(type: "int", nullable: false)
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
                name: "Order_Delivery_Schedule",
                columns: table => new
                {
                    OrderDeliveryScheduleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order_Delivery_Schedule", x => x.OrderDeliveryScheduleID);
                    table.ForeignKey(
                        name: "FK_Order_Delivery_Schedule_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stock_Take",
                columns: table => new
                {
                    StockTakeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stock_Take", x => x.StockTakeID);
                    table.ForeignKey(
                        name: "FK_Stock_Take_AspNetUsers_UserId",
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
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Refund",
                columns: table => new
                {
                    CustomerRefundID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerRefundReasonID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Refund", x => x.CustomerRefundID);
                    table.ForeignKey(
                        name: "FK_Customer_Refund_Customer_Refund_Reason_CustomerRefundReasonID",
                        column: x => x.CustomerRefundReasonID,
                        principalTable: "Customer_Refund_Reason",
                        principalColumn: "CustomerRefundReasonID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Estimate",
                columns: table => new
                {
                    EstimateID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstimateStatusID = table.Column<int>(type: "int", nullable: false),
                    EstimateDurationID = table.Column<int>(type: "int", nullable: false),
                    Confirmed_Total_Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estimate", x => x.EstimateID);
                    table.ForeignKey(
                        name: "FK_Estimate_Estimate_Duration_EstimateDurationID",
                        column: x => x.EstimateDurationID,
                        principalTable: "Estimate_Duration",
                        principalColumn: "EstimateDurationID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Estimate_Estimate_Status_EstimateStatusID",
                        column: x => x.EstimateStatusID,
                        principalTable: "Estimate_Status",
                        principalColumn: "EstimateStatusID",
                        onDelete: ReferentialAction.Cascade);
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
                        onDelete: ReferentialAction.Cascade);
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
                name: "User_Role_Permission",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    UserPermissionID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User_Role_Permission", x => new { x.RoleId, x.UserPermissionID });
                    table.ForeignKey(
                        name: "FK_User_Role_Permission_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_User_Role_Permission_User_Permission_UserPermissionID",
                        column: x => x.UserPermissionID,
                        principalTable: "User_Permission",
                        principalColumn: "UserPermissionID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Order",
                columns: table => new
                {
                    CustomerOrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerOrderStatusID = table.Column<int>(type: "int", nullable: false),
                    OrderDeliveryScheduleID = table.Column<int>(type: "int", nullable: true),
                    Date = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Delivery_Photo = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Order", x => x.CustomerOrderID);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Customer_Order_Status_CustomerOrderStatusID",
                        column: x => x.CustomerOrderStatusID,
                        principalTable: "Customer_Order_Status",
                        principalColumn: "CustomerOrderStatusID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Order_Delivery_Schedule_OrderDeliveryScheduleID",
                        column: x => x.OrderDeliveryScheduleID,
                        principalTable: "Order_Delivery_Schedule",
                        principalColumn: "OrderDeliveryScheduleID");
                });

            migrationBuilder.CreateTable(
                name: "Write_Off",
                columns: table => new
                {
                    WriteOffID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WriteOffReasonID = table.Column<int>(type: "int", nullable: false),
                    StockTakeID = table.Column<int>(type: "int", nullable: false),
                    QRCodeID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Write_Off", x => x.WriteOffID);
                    table.ForeignKey(
                        name: "FK_Write_Off_QR_Code_QRCodeID",
                        column: x => x.QRCodeID,
                        principalTable: "QR_Code",
                        principalColumn: "QRCodeID",
                        onDelete: ReferentialAction.Cascade);
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
                    Width = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Height = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Length = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Logo = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Label = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Custom_Product", x => x.CustomProductID);
                    table.ForeignKey(
                        name: "FK_Custom_Product_cost_Price_Formula_Variables_FormulaID",
                        column: x => x.FormulaID,
                        principalTable: "cost_Price_Formula_Variables",
                        principalColumn: "FormulaID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Custom_Product_Product_Item_ItemID",
                        column: x => x.ItemID,
                        principalTable: "Product_Item",
                        principalColumn: "ItemID",
                        onDelete: ReferentialAction.Cascade);
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
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
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
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Fixed_Product_Size_Units_SizeID",
                        column: x => x.SizeID,
                        principalTable: "Size_Units",
                        principalColumn: "SizeID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    PaymentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentTypeID = table.Column<int>(type: "int", nullable: false),
                    CustomerOrderID = table.Column<int>(type: "int", nullable: false),
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
                        principalColumn: "CustomerOrderID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payment_Payment_Type_PaymentTypeID",
                        column: x => x.PaymentTypeID,
                        principalTable: "Payment_Type",
                        principalColumn: "PaymentTypeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Order_Line",
                columns: table => new
                {
                    Customer_Order_LineID = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CustomerOrderID = table.Column<int>(type: "int", nullable: false),
                    CustomerRefundID = table.Column<int>(type: "int", nullable: true),
                    FixedProductID = table.Column<int>(type: "int", nullable: false),
                    CustomProductID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Order_Line", x => new { x.UserId, x.CustomerOrderID, x.Customer_Order_LineID });
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_Custom_Product_CustomProductID",
                        column: x => x.CustomProductID,
                        principalTable: "Custom_Product",
                        principalColumn: "CustomProductID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_Customer_Order_CustomerOrderID",
                        column: x => x.CustomerOrderID,
                        principalTable: "Customer_Order",
                        principalColumn: "CustomerOrderID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_Customer_Refund_CustomerRefundID",
                        column: x => x.CustomerRefundID,
                        principalTable: "Customer_Refund",
                        principalColumn: "CustomerRefundID");
                    table.ForeignKey(
                        name: "FK_Customer_Order_Line_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Estimate_Line",
                columns: table => new
                {
                    EstimateID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: true),
                    EstimateLineID = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CustomProductID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estimate_Line", x => new { x.UserId, x.EstimateID, x.EstimateLineID });
                    table.ForeignKey(
                        name: "FK_Estimate_Line_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Estimate_Line_Custom_Product_CustomProductID",
                        column: x => x.CustomProductID,
                        principalTable: "Custom_Product",
                        principalColumn: "CustomProductID");
                    table.ForeignKey(
                        name: "FK_Estimate_Line_Estimate_EstimateID",
                        column: x => x.EstimateID,
                        principalTable: "Estimate",
                        principalColumn: "EstimateID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Estimate_Line_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID");
                });

            migrationBuilder.CreateTable(
                name: "Supplier_OrderLine",
                columns: table => new
                {
                    Supplier_Order_LineID = table.Column<int>(type: "int", nullable: false),
                    SupplierID = table.Column<int>(type: "int", nullable: false),
                    SupplierOrderID = table.Column<int>(type: "int", nullable: false),
                    SupplierReturnID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: true),
                    RawMaterialID = table.Column<int>(type: "int", nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier_OrderLine", x => new { x.SupplierOrderID, x.SupplierID, x.Supplier_Order_LineID });
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
                        principalColumn: "SupplierReturnID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Supplier_OrderLine_Supplier_SupplierID",
                        column: x => x.SupplierID,
                        principalTable: "Supplier",
                        principalColumn: "SupplierID",
                        onDelete: ReferentialAction.Cascade);
                });

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
                name: "IX_Customer_Order_CustomerOrderStatusID",
                table: "Customer_Order",
                column: "CustomerOrderStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_OrderDeliveryScheduleID",
                table: "Customer_Order",
                column: "OrderDeliveryScheduleID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_CustomerOrderID",
                table: "Customer_Order_Line",
                column: "CustomerOrderID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_CustomerRefundID",
                table: "Customer_Order_Line",
                column: "CustomerRefundID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_CustomProductID",
                table: "Customer_Order_Line",
                column: "CustomProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Line_FixedProductID",
                table: "Customer_Order_Line",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Refund_CustomerRefundReasonID",
                table: "Customer_Refund",
                column: "CustomerRefundReasonID");

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_EstimateDurationID",
                table: "Estimate",
                column: "EstimateDurationID");

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_EstimateStatusID",
                table: "Estimate",
                column: "EstimateStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_Line_CustomProductID",
                table: "Estimate_Line",
                column: "CustomProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_Line_EstimateID",
                table: "Estimate_Line",
                column: "EstimateID");

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_Line_FixedProductID",
                table: "Estimate_Line",
                column: "FixedProductID");

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
                name: "IX_Payment_PaymentTypeID",
                table: "Payment",
                column: "PaymentTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Item_CategoryID",
                table: "Product_Item",
                column: "CategoryID");

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
                name: "IX_Supplier_OrderLine_FixedProductID",
                table: "Supplier_OrderLine",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLine_RawMaterialID",
                table: "Supplier_OrderLine",
                column: "RawMaterialID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLine_SupplierID",
                table: "Supplier_OrderLine",
                column: "SupplierID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLine_SupplierReturnID",
                table: "Supplier_OrderLine",
                column: "SupplierReturnID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Role_Permission_UserPermissionID",
                table: "User_Role_Permission",
                column: "UserPermissionID");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Off_QRCodeID",
                table: "Write_Off",
                column: "QRCodeID");

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
                name: "Category_Size_Variables");

            migrationBuilder.DropTable(
                name: "Credit_Application");

            migrationBuilder.DropTable(
                name: "Customer_Order_Line");

            migrationBuilder.DropTable(
                name: "Customer_Review");

            migrationBuilder.DropTable(
                name: "Discount");

            migrationBuilder.DropTable(
                name: "Estimate_Line");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "Supplier_OrderLine");

            migrationBuilder.DropTable(
                name: "User_Role_Permission");

            migrationBuilder.DropTable(
                name: "VAT");

            migrationBuilder.DropTable(
                name: "Write_Off");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Size_Variables");

            migrationBuilder.DropTable(
                name: "Credit_Application_Status");

            migrationBuilder.DropTable(
                name: "Customer_Refund");

            migrationBuilder.DropTable(
                name: "Custom_Product");

            migrationBuilder.DropTable(
                name: "Estimate");

            migrationBuilder.DropTable(
                name: "Customer_Order");

            migrationBuilder.DropTable(
                name: "Payment_Type");

            migrationBuilder.DropTable(
                name: "Fixed_Product");

            migrationBuilder.DropTable(
                name: "Raw_Material");

            migrationBuilder.DropTable(
                name: "Supplier_Order");

            migrationBuilder.DropTable(
                name: "Supplier_Return");

            migrationBuilder.DropTable(
                name: "Supplier");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "User_Permission");

            migrationBuilder.DropTable(
                name: "Stock_Take");

            migrationBuilder.DropTable(
                name: "Write_Off_Reason");

            migrationBuilder.DropTable(
                name: "Customer_Refund_Reason");

            migrationBuilder.DropTable(
                name: "cost_Price_Formula_Variables");

            migrationBuilder.DropTable(
                name: "Estimate_Duration");

            migrationBuilder.DropTable(
                name: "Estimate_Status");

            migrationBuilder.DropTable(
                name: "Customer_Order_Status");

            migrationBuilder.DropTable(
                name: "Order_Delivery_Schedule");

            migrationBuilder.DropTable(
                name: "Product_Item");

            migrationBuilder.DropTable(
                name: "Size_Units");

            migrationBuilder.DropTable(
                name: "QR_Code");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Product_Category");
        }
    }
}
