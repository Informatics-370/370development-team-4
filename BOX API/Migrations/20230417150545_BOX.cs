using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class BOX : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Audit_Trails",
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
                    table.PrimaryKey("PK_Audit_Trails", x => x.AuditTrailID);
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
                    Mark_Up = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Date = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cost_Price_Formula_Variables", x => x.FormulaID);
                });

            migrationBuilder.CreateTable(
                name: "Credit_Application_Statuses",
                columns: table => new
                {
                    CreditApplicationStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Credit_Application_Statuses", x => x.CreditApplicationStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Order_Statuses",
                columns: table => new
                {
                    CustomerOrderStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Order_Statuses", x => x.CustomerOrderStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Refund_Reasons",
                columns: table => new
                {
                    CustomerRefundReasonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Refund_Reasons", x => x.CustomerRefundReasonID);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Reviews",
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
                    table.PrimaryKey("PK_Customer_Reviews", x => x.CustomerReviewID);
                });

            migrationBuilder.CreateTable(
                name: "Discounts",
                columns: table => new
                {
                    DiscountID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Percentage = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Discounts", x => x.DiscountID);
                });

            migrationBuilder.CreateTable(
                name: "Estimate_Durations",
                columns: table => new
                {
                    EstimateDurationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Duration = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estimate_Durations", x => x.EstimateDurationID);
                });

            migrationBuilder.CreateTable(
                name: "Estimate_Statuses",
                columns: table => new
                {
                    EstimateStatusID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estimate_Statuses", x => x.EstimateStatusID);
                });

            migrationBuilder.CreateTable(
                name: "Fixed_Prices",
                columns: table => new
                {
                    PriceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fixed_Prices", x => x.PriceID);
                });

            migrationBuilder.CreateTable(
                name: "Payment_Types",
                columns: table => new
                {
                    PaymentTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment_Types", x => x.PaymentTypeID);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleID);
                });

            migrationBuilder.CreateTable(
                name: "Sizes",
                columns: table => new
                {
                    SizeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Width = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Height = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Length = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Volume = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sizes", x => x.SizeID);
                });

            migrationBuilder.CreateTable(
                name: "Supplier_Returns",
                columns: table => new
                {
                    SupplierReturnID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier_Returns", x => x.SupplierReturnID);
                });

            migrationBuilder.CreateTable(
                name: "User_Permissions",
                columns: table => new
                {
                    UserPermissionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User_Permissions", x => x.UserPermissionID);
                });

            migrationBuilder.CreateTable(
                name: "VATs",
                columns: table => new
                {
                    VatID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<int>(type: "int", nullable: false),
                    Percentage = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VATs", x => x.VatID);
                });

            migrationBuilder.CreateTable(
                name: "Write_Off_Reasons",
                columns: table => new
                {
                    WriteOffReasonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Write_Off_Reasons", x => x.WriteOffReasonID);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Refunds",
                columns: table => new
                {
                    CustomerRefundID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerRefundReasonID = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Refunds", x => x.CustomerRefundID);
                    table.ForeignKey(
                        name: "FK_Customer_Refunds_Customer_Refund_Reasons_CustomerRefundReasonID",
                        column: x => x.CustomerRefundReasonID,
                        principalTable: "Customer_Refund_Reasons",
                        principalColumn: "CustomerRefundReasonID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Estimates",
                columns: table => new
                {
                    EstimateID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EstimateStatusID = table.Column<int>(type: "int", nullable: false),
                    EstimateDurationID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estimates", x => x.EstimateID);
                    table.ForeignKey(
                        name: "FK_Estimates_Estimate_Durations_EstimateDurationID",
                        column: x => x.EstimateDurationID,
                        principalTable: "Estimate_Durations",
                        principalColumn: "EstimateDurationID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Estimates_Estimate_Statuses_EstimateStatusID",
                        column: x => x.EstimateStatusID,
                        principalTable: "Estimate_Statuses",
                        principalColumn: "EstimateStatusID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleID = table.Column<int>(type: "int", nullable: false),
                    user_FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    user_LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    user_Email = table.Column<string>(type: "nvarchar(75)", maxLength: 75, nullable: false),
                    user_Password = table.Column<string>(type: "nvarchar(16)", maxLength: 16, nullable: false),
                    user_Cellnum = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    user_Address = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    title = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleID",
                        column: x => x.RoleID,
                        principalTable: "Roles",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "User_Role_Permissions",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    UserPermissionID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User_Role_Permissions", x => new { x.RoleId, x.UserPermissionID });
                    table.ForeignKey(
                        name: "FK_User_Role_Permissions_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_User_Role_Permissions_User_Permissions_UserPermissionID",
                        column: x => x.UserPermissionID,
                        principalTable: "User_Permissions",
                        principalColumn: "UserPermissionID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    AdminID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.AdminID);
                    table.ForeignKey(
                        name: "FK_Admins_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeID);
                    table.ForeignKey(
                        name: "FK_Employees_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Product_Categories",
                columns: table => new
                {
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdminID = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product_Categories", x => x.CategoryID);
                    table.ForeignKey(
                        name: "FK_Product_Categories_Admins_AdminID",
                        column: x => x.AdminID,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QR_Codes",
                columns: table => new
                {
                    QRCodeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdminID = table.Column<int>(type: "int", nullable: false),
                    QR_Code_Photo = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QR_Codes", x => x.QRCodeID);
                    table.ForeignKey(
                        name: "FK_QR_Codes_Admins_AdminID",
                        column: x => x.AdminID,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    customerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    isBusiness = table.Column<bool>(type: "bit", nullable: false),
                    VAT_NO = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Credit_Limit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Credit_Balance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Discount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.customerID);
                    table.ForeignKey(
                        name: "FK_Customers_Employees_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Employees",
                        principalColumn: "EmployeeID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customers_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Order_Delivery_Schedules",
                columns: table => new
                {
                    OrderDeliveryScheduleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order_Delivery_Schedules", x => x.OrderDeliveryScheduleID);
                    table.ForeignKey(
                        name: "FK_Order_Delivery_Schedules_Employees_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Employees",
                        principalColumn: "EmployeeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stock_Takes",
                columns: table => new
                {
                    StockTakeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stock_Takes", x => x.StockTakeID);
                    table.ForeignKey(
                        name: "FK_Stock_Takes_Employees_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Employees",
                        principalColumn: "EmployeeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Product_Items",
                columns: table => new
                {
                    ItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(70)", maxLength: 70, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product_Items", x => x.ItemID);
                    table.ForeignKey(
                        name: "FK_Product_Items_Product_Categories_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "Product_Categories",
                        principalColumn: "CategoryID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Raw_Materials",
                columns: table => new
                {
                    RawMaterialID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QRCodeID = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(70)", maxLength: 70, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Raw_Materials", x => x.RawMaterialID);
                    table.ForeignKey(
                        name: "FK_Raw_Materials_QR_Codes_QRCodeID",
                        column: x => x.QRCodeID,
                        principalTable: "QR_Codes",
                        principalColumn: "QRCodeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Credit_Applications",
                columns: table => new
                {
                    creditApplicationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreditApplicationStatusID = table.Column<int>(type: "int", nullable: false),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    AdminID = table.Column<int>(type: "int", nullable: false),
                    Application_Pdf = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Credit_Applications", x => x.creditApplicationID);
                    table.ForeignKey(
                        name: "FK_Credit_Applications_Admins_AdminID",
                        column: x => x.AdminID,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Credit_Applications_Credit_Application_Statuses_CreditApplicationStatusID",
                        column: x => x.CreditApplicationStatusID,
                        principalTable: "Credit_Application_Statuses",
                        principalColumn: "CreditApplicationStatusID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Credit_Applications_Customers_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customers",
                        principalColumn: "customerID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Estimate_Lines",
                columns: table => new
                {
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    EstimateID = table.Column<int>(type: "int", nullable: false),
                    AdminID = table.Column<int>(type: "int", nullable: false),
                    Confirmed_Unit_Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Estimate_Lines", x => new { x.CustomerID, x.EstimateID });
                    table.ForeignKey(
                        name: "FK_Estimate_Lines_Admins_AdminID",
                        column: x => x.AdminID,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Estimate_Lines_Customers_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customers",
                        principalColumn: "customerID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Estimate_Lines_Estimates_EstimateID",
                        column: x => x.EstimateID,
                        principalTable: "Estimates",
                        principalColumn: "EstimateID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    PaymentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentTypeID = table.Column<int>(type: "int", nullable: false),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    Date_And_Time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.PaymentID);
                    table.ForeignKey(
                        name: "FK_Payments_Customers_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customers",
                        principalColumn: "customerID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payments_Payment_Types_PaymentTypeID",
                        column: x => x.PaymentTypeID,
                        principalTable: "Payment_Types",
                        principalColumn: "PaymentTypeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Orders",
                columns: table => new
                {
                    CustomerOrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerOrderStatusID = table.Column<int>(type: "int", nullable: false),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    OrderDeliveryScheduleID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<int>(type: "int", nullable: false),
                    Delivery_Photo = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Orders", x => x.CustomerOrderID);
                    table.ForeignKey(
                        name: "FK_Customer_Orders_Customer_Order_Statuses_CustomerOrderStatusID",
                        column: x => x.CustomerOrderStatusID,
                        principalTable: "Customer_Order_Statuses",
                        principalColumn: "CustomerOrderStatusID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Orders_Customers_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customers",
                        principalColumn: "customerID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Orders_Order_Delivery_Schedules_OrderDeliveryScheduleID",
                        column: x => x.OrderDeliveryScheduleID,
                        principalTable: "Order_Delivery_Schedules",
                        principalColumn: "OrderDeliveryScheduleID",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Write_Offs",
                columns: table => new
                {
                    WriteOffID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WriteOffReasonID = table.Column<int>(type: "int", nullable: false),
                    StockTakeID = table.Column<int>(type: "int", nullable: false),
                    QRCodeID = table.Column<int>(type: "int", nullable: false),
                    AdminID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Write_Offs", x => x.WriteOffID);
                    table.ForeignKey(
                        name: "FK_Write_Offs_Admins_AdminID",
                        column: x => x.AdminID,
                        principalTable: "Admins",
                        principalColumn: "AdminID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Write_Offs_QR_Codes_QRCodeID",
                        column: x => x.QRCodeID,
                        principalTable: "QR_Codes",
                        principalColumn: "QRCodeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Write_Offs_Stock_Takes_StockTakeID",
                        column: x => x.StockTakeID,
                        principalTable: "Stock_Takes",
                        principalColumn: "StockTakeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Write_Offs_Write_Off_Reasons_WriteOffReasonID",
                        column: x => x.WriteOffReasonID,
                        principalTable: "Write_Off_Reasons",
                        principalColumn: "WriteOffReasonID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Custom_Products",
                columns: table => new
                {
                    CustomProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemID = table.Column<int>(type: "int", nullable: false),
                    FormulaID = table.Column<int>(type: "int", nullable: false),
                    Width = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Logo = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Label = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Custom_Products", x => x.CustomProductID);
                    table.ForeignKey(
                        name: "FK_Custom_Products_cost_Price_Formula_Variables_FormulaID",
                        column: x => x.FormulaID,
                        principalTable: "cost_Price_Formula_Variables",
                        principalColumn: "FormulaID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Custom_Products_Product_Items_ItemID",
                        column: x => x.ItemID,
                        principalTable: "Product_Items",
                        principalColumn: "ItemID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Fixed_Product",
                columns: table => new
                {
                    FixedProductID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SizeID = table.Column<int>(type: "int", nullable: false),
                    QRCodeID = table.Column<int>(type: "int", nullable: false),
                    ItemID = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fixed_Product", x => x.FixedProductID);
                    table.ForeignKey(
                        name: "FK_Fixed_Product_Product_Items_ItemID",
                        column: x => x.ItemID,
                        principalTable: "Product_Items",
                        principalColumn: "ItemID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Fixed_Product_QR_Codes_QRCodeID",
                        column: x => x.QRCodeID,
                        principalTable: "QR_Codes",
                        principalColumn: "QRCodeID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Fixed_Product_Sizes_SizeID",
                        column: x => x.SizeID,
                        principalTable: "Sizes",
                        principalColumn: "SizeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Customer_Order_Lines",
                columns: table => new
                {
                    CustomerOrderID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: false),
                    CustomProductID = table.Column<int>(type: "int", nullable: false),
                    CustomerRefundID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customer_Order_Lines", x => new { x.CustomerOrderID, x.FixedProductID, x.CustomProductID });
                    table.ForeignKey(
                        name: "FK_Customer_Order_Lines_Custom_Products_CustomProductID",
                        column: x => x.CustomProductID,
                        principalTable: "Custom_Products",
                        principalColumn: "CustomProductID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Lines_Customer_Orders_CustomerOrderID",
                        column: x => x.CustomerOrderID,
                        principalTable: "Customer_Orders",
                        principalColumn: "CustomerOrderID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Lines_Customer_Refunds_CustomerRefundID",
                        column: x => x.CustomerRefundID,
                        principalTable: "Customer_Refunds",
                        principalColumn: "CustomerRefundID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Customer_Order_Lines_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FixedProductSizes",
                columns: table => new
                {
                    FixedProductSizeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SizeID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FixedProductSizes", x => x.FixedProductSizeID);
                    table.ForeignKey(
                        name: "FK_FixedProductSizes_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FixedProductSizes_Sizes_SizeID",
                        column: x => x.SizeID,
                        principalTable: "Sizes",
                        principalColumn: "SizeID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    SupplierID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Contact_Number = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(75)", maxLength: 75, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.SupplierID);
                    table.ForeignKey(
                        name: "FK_Suppliers_Fixed_Product_UserID",
                        column: x => x.UserID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Supplier_Orders",
                columns: table => new
                {
                    SupplierOrderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier_Orders", x => x.SupplierOrderID);
                    table.ForeignKey(
                        name: "FK_Supplier_Orders_Suppliers_SupplierID",
                        column: x => x.SupplierID,
                        principalTable: "Suppliers",
                        principalColumn: "SupplierID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Supplier_OrderLines",
                columns: table => new
                {
                    SupplierOrderID = table.Column<int>(type: "int", nullable: false),
                    FixedProductID = table.Column<int>(type: "int", nullable: false),
                    RawMaterialID = table.Column<int>(type: "int", nullable: false),
                    SupplierReturnID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplier_OrderLines", x => new { x.SupplierOrderID, x.FixedProductID, x.RawMaterialID });
                    table.ForeignKey(
                        name: "FK_Supplier_OrderLines_Fixed_Product_FixedProductID",
                        column: x => x.FixedProductID,
                        principalTable: "Fixed_Product",
                        principalColumn: "FixedProductID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Supplier_OrderLines_Raw_Materials_RawMaterialID",
                        column: x => x.RawMaterialID,
                        principalTable: "Raw_Materials",
                        principalColumn: "RawMaterialID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Supplier_OrderLines_Supplier_Orders_SupplierOrderID",
                        column: x => x.SupplierOrderID,
                        principalTable: "Supplier_Orders",
                        principalColumn: "SupplierOrderID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Supplier_OrderLines_Supplier_Returns_SupplierReturnID",
                        column: x => x.SupplierReturnID,
                        principalTable: "Supplier_Returns",
                        principalColumn: "SupplierReturnID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admins_UserID",
                table: "Admins",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Credit_Applications_AdminID",
                table: "Credit_Applications",
                column: "AdminID");

            migrationBuilder.CreateIndex(
                name: "IX_Credit_Applications_CreditApplicationStatusID",
                table: "Credit_Applications",
                column: "CreditApplicationStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Credit_Applications_CustomerID",
                table: "Credit_Applications",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Custom_Products_FormulaID",
                table: "Custom_Products",
                column: "FormulaID");

            migrationBuilder.CreateIndex(
                name: "IX_Custom_Products_ItemID",
                table: "Custom_Products",
                column: "ItemID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Lines_CustomerRefundID",
                table: "Customer_Order_Lines",
                column: "CustomerRefundID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Lines_CustomProductID",
                table: "Customer_Order_Lines",
                column: "CustomProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Order_Lines_FixedProductID",
                table: "Customer_Order_Lines",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Orders_CustomerID",
                table: "Customer_Orders",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Orders_CustomerOrderStatusID",
                table: "Customer_Orders",
                column: "CustomerOrderStatusID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Orders_OrderDeliveryScheduleID",
                table: "Customer_Orders",
                column: "OrderDeliveryScheduleID");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_Refunds_CustomerRefundReasonID",
                table: "Customer_Refunds",
                column: "CustomerRefundReasonID");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_EmployeeID",
                table: "Customers",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_UserID",
                table: "Customers",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_UserID",
                table: "Employees",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_Lines_AdminID",
                table: "Estimate_Lines",
                column: "AdminID");

            migrationBuilder.CreateIndex(
                name: "IX_Estimate_Lines_EstimateID",
                table: "Estimate_Lines",
                column: "EstimateID");

            migrationBuilder.CreateIndex(
                name: "IX_Estimates_EstimateDurationID",
                table: "Estimates",
                column: "EstimateDurationID");

            migrationBuilder.CreateIndex(
                name: "IX_Estimates_EstimateStatusID",
                table: "Estimates",
                column: "EstimateStatusID");

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
                name: "IX_FixedProductSizes_FixedProductID",
                table: "FixedProductSizes",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_FixedProductSizes_SizeID",
                table: "FixedProductSizes",
                column: "SizeID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_Delivery_Schedules_EmployeeID",
                table: "Order_Delivery_Schedules",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_CustomerID",
                table: "Payments",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PaymentTypeID",
                table: "Payments",
                column: "PaymentTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Categories_AdminID",
                table: "Product_Categories",
                column: "AdminID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Items_CategoryID",
                table: "Product_Items",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_QR_Codes_AdminID",
                table: "QR_Codes",
                column: "AdminID");

            migrationBuilder.CreateIndex(
                name: "IX_Raw_Materials_QRCodeID",
                table: "Raw_Materials",
                column: "QRCodeID");

            migrationBuilder.CreateIndex(
                name: "IX_Stock_Takes_EmployeeID",
                table: "Stock_Takes",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLines_FixedProductID",
                table: "Supplier_OrderLines",
                column: "FixedProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLines_RawMaterialID",
                table: "Supplier_OrderLines",
                column: "RawMaterialID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_OrderLines_SupplierReturnID",
                table: "Supplier_OrderLines",
                column: "SupplierReturnID");

            migrationBuilder.CreateIndex(
                name: "IX_Supplier_Orders_SupplierID",
                table: "Supplier_Orders",
                column: "SupplierID");

            migrationBuilder.CreateIndex(
                name: "IX_Suppliers_UserID",
                table: "Suppliers",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_User_Role_Permissions_UserPermissionID",
                table: "User_Role_Permissions",
                column: "UserPermissionID");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleID",
                table: "Users",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Offs_AdminID",
                table: "Write_Offs",
                column: "AdminID");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Offs_QRCodeID",
                table: "Write_Offs",
                column: "QRCodeID");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Offs_StockTakeID",
                table: "Write_Offs",
                column: "StockTakeID");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Offs_WriteOffReasonID",
                table: "Write_Offs",
                column: "WriteOffReasonID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Audit_Trails");

            migrationBuilder.DropTable(
                name: "Credit_Applications");

            migrationBuilder.DropTable(
                name: "Customer_Order_Lines");

            migrationBuilder.DropTable(
                name: "Customer_Reviews");

            migrationBuilder.DropTable(
                name: "Discounts");

            migrationBuilder.DropTable(
                name: "Estimate_Lines");

            migrationBuilder.DropTable(
                name: "Fixed_Prices");

            migrationBuilder.DropTable(
                name: "FixedProductSizes");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "Supplier_OrderLines");

            migrationBuilder.DropTable(
                name: "User_Role_Permissions");

            migrationBuilder.DropTable(
                name: "VATs");

            migrationBuilder.DropTable(
                name: "Write_Offs");

            migrationBuilder.DropTable(
                name: "Credit_Application_Statuses");

            migrationBuilder.DropTable(
                name: "Custom_Products");

            migrationBuilder.DropTable(
                name: "Customer_Orders");

            migrationBuilder.DropTable(
                name: "Customer_Refunds");

            migrationBuilder.DropTable(
                name: "Estimates");

            migrationBuilder.DropTable(
                name: "Payment_Types");

            migrationBuilder.DropTable(
                name: "Raw_Materials");

            migrationBuilder.DropTable(
                name: "Supplier_Orders");

            migrationBuilder.DropTable(
                name: "Supplier_Returns");

            migrationBuilder.DropTable(
                name: "User_Permissions");

            migrationBuilder.DropTable(
                name: "Stock_Takes");

            migrationBuilder.DropTable(
                name: "Write_Off_Reasons");

            migrationBuilder.DropTable(
                name: "cost_Price_Formula_Variables");

            migrationBuilder.DropTable(
                name: "Customer_Order_Statuses");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Order_Delivery_Schedules");

            migrationBuilder.DropTable(
                name: "Customer_Refund_Reasons");

            migrationBuilder.DropTable(
                name: "Estimate_Durations");

            migrationBuilder.DropTable(
                name: "Estimate_Statuses");

            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Fixed_Product");

            migrationBuilder.DropTable(
                name: "Product_Items");

            migrationBuilder.DropTable(
                name: "QR_Codes");

            migrationBuilder.DropTable(
                name: "Sizes");

            migrationBuilder.DropTable(
                name: "Product_Categories");

            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
