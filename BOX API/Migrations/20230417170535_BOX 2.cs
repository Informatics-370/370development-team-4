using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BOX.Migrations
{
    public partial class BOX2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admins_Users_UserID",
                table: "Admins");

            migrationBuilder.DropForeignKey(
                name: "FK_Credit_Applications_Admins_AdminID",
                table: "Credit_Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Credit_Applications_Credit_Application_Statuses_CreditApplicationStatusID",
                table: "Credit_Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Credit_Applications_Customers_CustomerID",
                table: "Credit_Applications");

            migrationBuilder.DropForeignKey(
                name: "FK_Custom_Products_cost_Price_Formula_Variables_FormulaID",
                table: "Custom_Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Custom_Products_Product_Items_ItemID",
                table: "Custom_Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Lines_Custom_Products_CustomProductID",
                table: "Customer_Order_Lines");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Lines_Customer_Orders_CustomerOrderID",
                table: "Customer_Order_Lines");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Lines_Customer_Refunds_CustomerRefundID",
                table: "Customer_Order_Lines");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Lines_Fixed_Product_FixedProductID",
                table: "Customer_Order_Lines");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Orders_Customer_Order_Statuses_CustomerOrderStatusID",
                table: "Customer_Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Orders_Customers_CustomerID",
                table: "Customer_Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Orders_Order_Delivery_Schedules_OrderDeliveryScheduleID",
                table: "Customer_Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Refunds_Customer_Refund_Reasons_CustomerRefundReasonID",
                table: "Customer_Refunds");

            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Employees_EmployeeID",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Users_UserID",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Users_UserID",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Lines_Admins_AdminID",
                table: "Estimate_Lines");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Lines_Customers_CustomerID",
                table: "Estimate_Lines");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Lines_Estimates_EstimateID",
                table: "Estimate_Lines");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimates_Estimate_Durations_EstimateDurationID",
                table: "Estimates");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimates_Estimate_Statuses_EstimateStatusID",
                table: "Estimates");

            migrationBuilder.DropForeignKey(
                name: "FK_Fixed_Product_Product_Items_ItemID",
                table: "Fixed_Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Fixed_Product_QR_Codes_QRCodeID",
                table: "Fixed_Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Fixed_Product_Sizes_SizeID",
                table: "Fixed_Product");

            migrationBuilder.DropForeignKey(
                name: "FK_FixedProductSizes_Fixed_Product_FixedProductID",
                table: "FixedProductSizes");

            migrationBuilder.DropForeignKey(
                name: "FK_FixedProductSizes_Sizes_SizeID",
                table: "FixedProductSizes");

            migrationBuilder.DropForeignKey(
                name: "FK_Order_Delivery_Schedules_Employees_EmployeeID",
                table: "Order_Delivery_Schedules");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Customers_CustomerID",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Payment_Types_PaymentTypeID",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_Categories_Admins_AdminID",
                table: "Product_Categories");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_Items_Product_Categories_CategoryID",
                table: "Product_Items");

            migrationBuilder.DropForeignKey(
                name: "FK_QR_Codes_Admins_AdminID",
                table: "QR_Codes");

            migrationBuilder.DropForeignKey(
                name: "FK_Raw_Materials_QR_Codes_QRCodeID",
                table: "Raw_Materials");

            migrationBuilder.DropForeignKey(
                name: "FK_Stock_Takes_Employees_EmployeeID",
                table: "Stock_Takes");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLines_Fixed_Product_FixedProductID",
                table: "Supplier_OrderLines");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLines_Raw_Materials_RawMaterialID",
                table: "Supplier_OrderLines");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLines_Supplier_Orders_SupplierOrderID",
                table: "Supplier_OrderLines");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLines_Supplier_Returns_SupplierReturnID",
                table: "Supplier_OrderLines");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_Orders_Suppliers_SupplierID",
                table: "Supplier_Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Suppliers_Fixed_Product_UserID",
                table: "Suppliers");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Permissions_Roles_RoleId",
                table: "User_Role_Permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Permissions_User_Permissions_UserPermissionID",
                table: "User_Role_Permissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleID",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Write_Offs_Admins_AdminID",
                table: "Write_Offs");

            migrationBuilder.DropForeignKey(
                name: "FK_Write_Offs_QR_Codes_QRCodeID",
                table: "Write_Offs");

            migrationBuilder.DropForeignKey(
                name: "FK_Write_Offs_Stock_Takes_StockTakeID",
                table: "Write_Offs");

            migrationBuilder.DropForeignKey(
                name: "FK_Write_Offs_Write_Off_Reasons_WriteOffReasonID",
                table: "Write_Offs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Write_Offs",
                table: "Write_Offs");

            migrationBuilder.DropIndex(
                name: "IX_Write_Offs_AdminID",
                table: "Write_Offs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Write_Off_Reasons",
                table: "Write_Off_Reasons");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VATs",
                table: "VATs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Role_Permissions",
                table: "User_Role_Permissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Permissions",
                table: "User_Permissions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Suppliers",
                table: "Suppliers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Supplier_Returns",
                table: "Supplier_Returns");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Supplier_Orders",
                table: "Supplier_Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Supplier_OrderLines",
                table: "Supplier_OrderLines");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Stock_Takes",
                table: "Stock_Takes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Sizes",
                table: "Sizes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Roles",
                table: "Roles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Raw_Materials",
                table: "Raw_Materials");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QR_Codes",
                table: "QR_Codes");

            migrationBuilder.DropIndex(
                name: "IX_QR_Codes_AdminID",
                table: "QR_Codes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Product_Items",
                table: "Product_Items");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Product_Categories",
                table: "Product_Categories");

            migrationBuilder.DropIndex(
                name: "IX_Product_Categories_AdminID",
                table: "Product_Categories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Payments",
                table: "Payments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Payment_Types",
                table: "Payment_Types");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Order_Delivery_Schedules",
                table: "Order_Delivery_Schedules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FixedProductSizes",
                table: "FixedProductSizes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Fixed_Prices",
                table: "Fixed_Prices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimates",
                table: "Estimates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimate_Statuses",
                table: "Estimate_Statuses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimate_Lines",
                table: "Estimate_Lines");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimate_Durations",
                table: "Estimate_Durations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Employees",
                table: "Employees");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Discounts",
                table: "Discounts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customers",
                table: "Customers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Reviews",
                table: "Customer_Reviews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Refunds",
                table: "Customer_Refunds");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Refund_Reasons",
                table: "Customer_Refund_Reasons");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Orders",
                table: "Customer_Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Order_Statuses",
                table: "Customer_Order_Statuses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Order_Lines",
                table: "Customer_Order_Lines");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Custom_Products",
                table: "Custom_Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Credit_Applications",
                table: "Credit_Applications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Credit_Application_Statuses",
                table: "Credit_Application_Statuses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Audit_Trails",
                table: "Audit_Trails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Admins",
                table: "Admins");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "cost_Price_Formula_Variables");

            migrationBuilder.DropColumn(
                name: "AdminID",
                table: "Write_Offs");

            migrationBuilder.DropColumn(
                name: "AdminID",
                table: "QR_Codes");

            migrationBuilder.DropColumn(
                name: "AdminID",
                table: "Product_Categories");

            migrationBuilder.RenameTable(
                name: "Write_Offs",
                newName: "Write_Off");

            migrationBuilder.RenameTable(
                name: "Write_Off_Reasons",
                newName: "Write_Off_Reason");

            migrationBuilder.RenameTable(
                name: "VATs",
                newName: "VAT");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "User");

            migrationBuilder.RenameTable(
                name: "User_Role_Permissions",
                newName: "User_Role_Permission");

            migrationBuilder.RenameTable(
                name: "User_Permissions",
                newName: "User_Permission");

            migrationBuilder.RenameTable(
                name: "Suppliers",
                newName: "Supplier");

            migrationBuilder.RenameTable(
                name: "Supplier_Returns",
                newName: "Supplier_Return");

            migrationBuilder.RenameTable(
                name: "Supplier_Orders",
                newName: "Supplier_Order");

            migrationBuilder.RenameTable(
                name: "Supplier_OrderLines",
                newName: "Supplier_OrderLine");

            migrationBuilder.RenameTable(
                name: "Stock_Takes",
                newName: "Stock_Take");

            migrationBuilder.RenameTable(
                name: "Sizes",
                newName: "Size");

            migrationBuilder.RenameTable(
                name: "Roles",
                newName: "Role");

            migrationBuilder.RenameTable(
                name: "Raw_Materials",
                newName: "Raw_Material");

            migrationBuilder.RenameTable(
                name: "QR_Codes",
                newName: "QR_Code");

            migrationBuilder.RenameTable(
                name: "Product_Items",
                newName: "Product_Item");

            migrationBuilder.RenameTable(
                name: "Product_Categories",
                newName: "Product_Category");

            migrationBuilder.RenameTable(
                name: "Payments",
                newName: "Payment");

            migrationBuilder.RenameTable(
                name: "Payment_Types",
                newName: "Payment_Type");

            migrationBuilder.RenameTable(
                name: "Order_Delivery_Schedules",
                newName: "Order_Delivery_Schedule");

            migrationBuilder.RenameTable(
                name: "FixedProductSizes",
                newName: "FixedProductSize");

            migrationBuilder.RenameTable(
                name: "Fixed_Prices",
                newName: "Fixed_Price");

            migrationBuilder.RenameTable(
                name: "Estimates",
                newName: "Estimate");

            migrationBuilder.RenameTable(
                name: "Estimate_Statuses",
                newName: "Estimate_Status");

            migrationBuilder.RenameTable(
                name: "Estimate_Lines",
                newName: "Estimate_Line");

            migrationBuilder.RenameTable(
                name: "Estimate_Durations",
                newName: "Estimate_Duration");

            migrationBuilder.RenameTable(
                name: "Employees",
                newName: "Employee");

            migrationBuilder.RenameTable(
                name: "Discounts",
                newName: "Discount");

            migrationBuilder.RenameTable(
                name: "Customers",
                newName: "Customer");

            migrationBuilder.RenameTable(
                name: "Customer_Reviews",
                newName: "Customer_Review");

            migrationBuilder.RenameTable(
                name: "Customer_Refunds",
                newName: "Customer_Refund");

            migrationBuilder.RenameTable(
                name: "Customer_Refund_Reasons",
                newName: "Customer_Refund_Reason");

            migrationBuilder.RenameTable(
                name: "Customer_Orders",
                newName: "Customer_Order");

            migrationBuilder.RenameTable(
                name: "Customer_Order_Statuses",
                newName: "Customer_Order_Status");

            migrationBuilder.RenameTable(
                name: "Customer_Order_Lines",
                newName: "Customer_Order_Line");

            migrationBuilder.RenameTable(
                name: "Custom_Products",
                newName: "Custom_Product");

            migrationBuilder.RenameTable(
                name: "Credit_Applications",
                newName: "Credit_Application");

            migrationBuilder.RenameTable(
                name: "Credit_Application_Statuses",
                newName: "Credit_Application_Status");

            migrationBuilder.RenameTable(
                name: "Audit_Trails",
                newName: "Audit_Trail");

            migrationBuilder.RenameTable(
                name: "Admins",
                newName: "Admin");

            migrationBuilder.RenameIndex(
                name: "IX_Write_Offs_WriteOffReasonID",
                table: "Write_Off",
                newName: "IX_Write_Off_WriteOffReasonID");

            migrationBuilder.RenameIndex(
                name: "IX_Write_Offs_StockTakeID",
                table: "Write_Off",
                newName: "IX_Write_Off_StockTakeID");

            migrationBuilder.RenameIndex(
                name: "IX_Write_Offs_QRCodeID",
                table: "Write_Off",
                newName: "IX_Write_Off_QRCodeID");

            migrationBuilder.RenameIndex(
                name: "IX_Users_RoleID",
                table: "User",
                newName: "IX_User_RoleID");

            migrationBuilder.RenameIndex(
                name: "IX_User_Role_Permissions_UserPermissionID",
                table: "User_Role_Permission",
                newName: "IX_User_Role_Permission_UserPermissionID");

            migrationBuilder.RenameIndex(
                name: "IX_Suppliers_UserID",
                table: "Supplier",
                newName: "IX_Supplier_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_Orders_SupplierID",
                table: "Supplier_Order",
                newName: "IX_Supplier_Order_SupplierID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_OrderLines_SupplierReturnID",
                table: "Supplier_OrderLine",
                newName: "IX_Supplier_OrderLine_SupplierReturnID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_OrderLines_RawMaterialID",
                table: "Supplier_OrderLine",
                newName: "IX_Supplier_OrderLine_RawMaterialID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_OrderLines_FixedProductID",
                table: "Supplier_OrderLine",
                newName: "IX_Supplier_OrderLine_FixedProductID");

            migrationBuilder.RenameIndex(
                name: "IX_Stock_Takes_EmployeeID",
                table: "Stock_Take",
                newName: "IX_Stock_Take_EmployeeID");

            migrationBuilder.RenameIndex(
                name: "IX_Raw_Materials_QRCodeID",
                table: "Raw_Material",
                newName: "IX_Raw_Material_QRCodeID");

            migrationBuilder.RenameIndex(
                name: "IX_Product_Items_CategoryID",
                table: "Product_Item",
                newName: "IX_Product_Item_CategoryID");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_PaymentTypeID",
                table: "Payment",
                newName: "IX_Payment_PaymentTypeID");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_CustomerID",
                table: "Payment",
                newName: "IX_Payment_CustomerID");

            migrationBuilder.RenameIndex(
                name: "IX_Order_Delivery_Schedules_EmployeeID",
                table: "Order_Delivery_Schedule",
                newName: "IX_Order_Delivery_Schedule_EmployeeID");

            migrationBuilder.RenameIndex(
                name: "IX_FixedProductSizes_SizeID",
                table: "FixedProductSize",
                newName: "IX_FixedProductSize_SizeID");

            migrationBuilder.RenameIndex(
                name: "IX_FixedProductSizes_FixedProductID",
                table: "FixedProductSize",
                newName: "IX_FixedProductSize_FixedProductID");

            migrationBuilder.RenameIndex(
                name: "IX_Estimates_EstimateStatusID",
                table: "Estimate",
                newName: "IX_Estimate_EstimateStatusID");

            migrationBuilder.RenameIndex(
                name: "IX_Estimates_EstimateDurationID",
                table: "Estimate",
                newName: "IX_Estimate_EstimateDurationID");

            migrationBuilder.RenameIndex(
                name: "IX_Estimate_Lines_EstimateID",
                table: "Estimate_Line",
                newName: "IX_Estimate_Line_EstimateID");

            migrationBuilder.RenameIndex(
                name: "IX_Estimate_Lines_AdminID",
                table: "Estimate_Line",
                newName: "IX_Estimate_Line_AdminID");

            migrationBuilder.RenameIndex(
                name: "IX_Employees_UserID",
                table: "Employee",
                newName: "IX_Employee_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_UserID",
                table: "Customer",
                newName: "IX_Customer_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Customers_EmployeeID",
                table: "Customer",
                newName: "IX_Customer_EmployeeID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Refunds_CustomerRefundReasonID",
                table: "Customer_Refund",
                newName: "IX_Customer_Refund_CustomerRefundReasonID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Orders_OrderDeliveryScheduleID",
                table: "Customer_Order",
                newName: "IX_Customer_Order_OrderDeliveryScheduleID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Orders_CustomerOrderStatusID",
                table: "Customer_Order",
                newName: "IX_Customer_Order_CustomerOrderStatusID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Orders_CustomerID",
                table: "Customer_Order",
                newName: "IX_Customer_Order_CustomerID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Order_Lines_FixedProductID",
                table: "Customer_Order_Line",
                newName: "IX_Customer_Order_Line_FixedProductID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Order_Lines_CustomProductID",
                table: "Customer_Order_Line",
                newName: "IX_Customer_Order_Line_CustomProductID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Order_Lines_CustomerRefundID",
                table: "Customer_Order_Line",
                newName: "IX_Customer_Order_Line_CustomerRefundID");

            migrationBuilder.RenameIndex(
                name: "IX_Custom_Products_ItemID",
                table: "Custom_Product",
                newName: "IX_Custom_Product_ItemID");

            migrationBuilder.RenameIndex(
                name: "IX_Custom_Products_FormulaID",
                table: "Custom_Product",
                newName: "IX_Custom_Product_FormulaID");

            migrationBuilder.RenameIndex(
                name: "IX_Credit_Applications_CustomerID",
                table: "Credit_Application",
                newName: "IX_Credit_Application_CustomerID");

            migrationBuilder.RenameIndex(
                name: "IX_Credit_Applications_CreditApplicationStatusID",
                table: "Credit_Application",
                newName: "IX_Credit_Application_CreditApplicationStatusID");

            migrationBuilder.RenameIndex(
                name: "IX_Credit_Applications_AdminID",
                table: "Credit_Application",
                newName: "IX_Credit_Application_AdminID");

            migrationBuilder.RenameIndex(
                name: "IX_Admins_UserID",
                table: "Admin",
                newName: "IX_Admin_UserID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Write_Off",
                table: "Write_Off",
                column: "WriteOffID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Write_Off_Reason",
                table: "Write_Off_Reason",
                column: "WriteOffReasonID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VAT",
                table: "VAT",
                column: "VatID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User",
                table: "User",
                column: "UserID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Role_Permission",
                table: "User_Role_Permission",
                columns: new[] { "RoleId", "UserPermissionID" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Permission",
                table: "User_Permission",
                column: "UserPermissionID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Supplier",
                table: "Supplier",
                column: "SupplierID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Supplier_Return",
                table: "Supplier_Return",
                column: "SupplierReturnID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Supplier_Order",
                table: "Supplier_Order",
                column: "SupplierOrderID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Supplier_OrderLine",
                table: "Supplier_OrderLine",
                columns: new[] { "SupplierOrderID", "FixedProductID", "RawMaterialID" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stock_Take",
                table: "Stock_Take",
                column: "StockTakeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Size",
                table: "Size",
                column: "SizeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Role",
                table: "Role",
                column: "RoleID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Raw_Material",
                table: "Raw_Material",
                column: "RawMaterialID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QR_Code",
                table: "QR_Code",
                column: "QRCodeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Product_Item",
                table: "Product_Item",
                column: "ItemID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Product_Category",
                table: "Product_Category",
                column: "CategoryID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payment",
                table: "Payment",
                column: "PaymentID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payment_Type",
                table: "Payment_Type",
                column: "PaymentTypeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Order_Delivery_Schedule",
                table: "Order_Delivery_Schedule",
                column: "OrderDeliveryScheduleID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FixedProductSize",
                table: "FixedProductSize",
                column: "FixedProductSizeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Fixed_Price",
                table: "Fixed_Price",
                column: "PriceID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimate",
                table: "Estimate",
                column: "EstimateID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimate_Status",
                table: "Estimate_Status",
                column: "EstimateStatusID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimate_Line",
                table: "Estimate_Line",
                columns: new[] { "CustomerID", "EstimateID" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimate_Duration",
                table: "Estimate_Duration",
                column: "EstimateDurationID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Employee",
                table: "Employee",
                column: "EmployeeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Discount",
                table: "Discount",
                column: "DiscountID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer",
                table: "Customer",
                column: "customerID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Review",
                table: "Customer_Review",
                column: "CustomerReviewID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Refund",
                table: "Customer_Refund",
                column: "CustomerRefundID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Refund_Reason",
                table: "Customer_Refund_Reason",
                column: "CustomerRefundReasonID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Order",
                table: "Customer_Order",
                column: "CustomerOrderID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Order_Status",
                table: "Customer_Order_Status",
                column: "CustomerOrderStatusID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Order_Line",
                table: "Customer_Order_Line",
                columns: new[] { "CustomerOrderID", "FixedProductID", "CustomProductID" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Custom_Product",
                table: "Custom_Product",
                column: "CustomProductID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Credit_Application",
                table: "Credit_Application",
                column: "creditApplicationID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Credit_Application_Status",
                table: "Credit_Application_Status",
                column: "CreditApplicationStatusID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Audit_Trail",
                table: "Audit_Trail",
                column: "AuditTrailID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Admin",
                table: "Admin",
                column: "AdminID");

            migrationBuilder.AddForeignKey(
                name: "FK_Admin_User_UserID",
                table: "Admin",
                column: "UserID",
                principalTable: "User",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Credit_Application_Admin_AdminID",
                table: "Credit_Application",
                column: "AdminID",
                principalTable: "Admin",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Credit_Application_Credit_Application_Status_CreditApplicationStatusID",
                table: "Credit_Application",
                column: "CreditApplicationStatusID",
                principalTable: "Credit_Application_Status",
                principalColumn: "CreditApplicationStatusID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Credit_Application_Customer_CustomerID",
                table: "Credit_Application",
                column: "CustomerID",
                principalTable: "Customer",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Custom_Product_cost_Price_Formula_Variables_FormulaID",
                table: "Custom_Product",
                column: "FormulaID",
                principalTable: "cost_Price_Formula_Variables",
                principalColumn: "FormulaID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Custom_Product_Product_Item_ItemID",
                table: "Custom_Product",
                column: "ItemID",
                principalTable: "Product_Item",
                principalColumn: "ItemID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Employee_EmployeeID",
                table: "Customer",
                column: "EmployeeID",
                principalTable: "Employee",
                principalColumn: "EmployeeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_User_UserID",
                table: "Customer",
                column: "UserID",
                principalTable: "User",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Customer_CustomerID",
                table: "Customer_Order",
                column: "CustomerID",
                principalTable: "Customer",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Customer_Order_Status_CustomerOrderStatusID",
                table: "Customer_Order",
                column: "CustomerOrderStatusID",
                principalTable: "Customer_Order_Status",
                principalColumn: "CustomerOrderStatusID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Order_Delivery_Schedule_OrderDeliveryScheduleID",
                table: "Customer_Order",
                column: "OrderDeliveryScheduleID",
                principalTable: "Order_Delivery_Schedule",
                principalColumn: "OrderDeliveryScheduleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Custom_Product_CustomProductID",
                table: "Customer_Order_Line",
                column: "CustomProductID",
                principalTable: "Custom_Product",
                principalColumn: "CustomProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Customer_Order_CustomerOrderID",
                table: "Customer_Order_Line",
                column: "CustomerOrderID",
                principalTable: "Customer_Order",
                principalColumn: "CustomerOrderID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Customer_Refund_CustomerRefundID",
                table: "Customer_Order_Line",
                column: "CustomerRefundID",
                principalTable: "Customer_Refund",
                principalColumn: "CustomerRefundID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Line_Fixed_Product_FixedProductID",
                table: "Customer_Order_Line",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Refund_Customer_Refund_Reason_CustomerRefundReasonID",
                table: "Customer_Refund",
                column: "CustomerRefundReasonID",
                principalTable: "Customer_Refund_Reason",
                principalColumn: "CustomerRefundReasonID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Employee_User_UserID",
                table: "Employee",
                column: "UserID",
                principalTable: "User",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Estimate_Duration_EstimateDurationID",
                table: "Estimate",
                column: "EstimateDurationID",
                principalTable: "Estimate_Duration",
                principalColumn: "EstimateDurationID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Estimate_Status_EstimateStatusID",
                table: "Estimate",
                column: "EstimateStatusID",
                principalTable: "Estimate_Status",
                principalColumn: "EstimateStatusID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Line_Admin_AdminID",
                table: "Estimate_Line",
                column: "AdminID",
                principalTable: "Admin",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Line_Customer_CustomerID",
                table: "Estimate_Line",
                column: "CustomerID",
                principalTable: "Customer",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Line_Estimate_EstimateID",
                table: "Estimate_Line",
                column: "EstimateID",
                principalTable: "Estimate",
                principalColumn: "EstimateID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Fixed_Product_Product_Item_ItemID",
                table: "Fixed_Product",
                column: "ItemID",
                principalTable: "Product_Item",
                principalColumn: "ItemID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Fixed_Product_QR_Code_QRCodeID",
                table: "Fixed_Product",
                column: "QRCodeID",
                principalTable: "QR_Code",
                principalColumn: "QRCodeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Fixed_Product_Size_SizeID",
                table: "Fixed_Product",
                column: "SizeID",
                principalTable: "Size",
                principalColumn: "SizeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FixedProductSize_Fixed_Product_FixedProductID",
                table: "FixedProductSize",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FixedProductSize_Size_SizeID",
                table: "FixedProductSize",
                column: "SizeID",
                principalTable: "Size",
                principalColumn: "SizeID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Delivery_Schedule_Employee_EmployeeID",
                table: "Order_Delivery_Schedule",
                column: "EmployeeID",
                principalTable: "Employee",
                principalColumn: "EmployeeID",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Customer_CustomerID",
                table: "Payment",
                column: "CustomerID",
                principalTable: "Customer",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Payment_Type_PaymentTypeID",
                table: "Payment",
                column: "PaymentTypeID",
                principalTable: "Payment_Type",
                principalColumn: "PaymentTypeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Product_Item_Product_Category_CategoryID",
                table: "Product_Item",
                column: "CategoryID",
                principalTable: "Product_Category",
                principalColumn: "CategoryID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Raw_Material_QR_Code_QRCodeID",
                table: "Raw_Material",
                column: "QRCodeID",
                principalTable: "QR_Code",
                principalColumn: "QRCodeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stock_Take_Employee_EmployeeID",
                table: "Stock_Take",
                column: "EmployeeID",
                principalTable: "Employee",
                principalColumn: "EmployeeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_Fixed_Product_UserID",
                table: "Supplier",
                column: "UserID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_Order_Supplier_SupplierID",
                table: "Supplier_Order",
                column: "SupplierID",
                principalTable: "Supplier",
                principalColumn: "SupplierID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLine_Fixed_Product_FixedProductID",
                table: "Supplier_OrderLine",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLine_Raw_Material_RawMaterialID",
                table: "Supplier_OrderLine",
                column: "RawMaterialID",
                principalTable: "Raw_Material",
                principalColumn: "RawMaterialID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLine_Supplier_Order_SupplierOrderID",
                table: "Supplier_OrderLine",
                column: "SupplierOrderID",
                principalTable: "Supplier_Order",
                principalColumn: "SupplierOrderID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLine_Supplier_Return_SupplierReturnID",
                table: "Supplier_OrderLine",
                column: "SupplierReturnID",
                principalTable: "Supplier_Return",
                principalColumn: "SupplierReturnID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_RoleID",
                table: "User",
                column: "RoleID",
                principalTable: "Role",
                principalColumn: "RoleID",
                onDelete: ReferentialAction.Cascade);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_QR_Code_QRCodeID",
                table: "Write_Off",
                column: "QRCodeID",
                principalTable: "QR_Code",
                principalColumn: "QRCodeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_Stock_Take_StockTakeID",
                table: "Write_Off",
                column: "StockTakeID",
                principalTable: "Stock_Take",
                principalColumn: "StockTakeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Off_Write_Off_Reason_WriteOffReasonID",
                table: "Write_Off",
                column: "WriteOffReasonID",
                principalTable: "Write_Off_Reason",
                principalColumn: "WriteOffReasonID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admin_User_UserID",
                table: "Admin");

            migrationBuilder.DropForeignKey(
                name: "FK_Credit_Application_Admin_AdminID",
                table: "Credit_Application");

            migrationBuilder.DropForeignKey(
                name: "FK_Credit_Application_Credit_Application_Status_CreditApplicationStatusID",
                table: "Credit_Application");

            migrationBuilder.DropForeignKey(
                name: "FK_Credit_Application_Customer_CustomerID",
                table: "Credit_Application");

            migrationBuilder.DropForeignKey(
                name: "FK_Custom_Product_cost_Price_Formula_Variables_FormulaID",
                table: "Custom_Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Custom_Product_Product_Item_ItemID",
                table: "Custom_Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Employee_EmployeeID",
                table: "Customer");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_User_UserID",
                table: "Customer");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Customer_CustomerID",
                table: "Customer_Order");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Customer_Order_Status_CustomerOrderStatusID",
                table: "Customer_Order");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Order_Delivery_Schedule_OrderDeliveryScheduleID",
                table: "Customer_Order");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Custom_Product_CustomProductID",
                table: "Customer_Order_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Customer_Order_CustomerOrderID",
                table: "Customer_Order_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Customer_Refund_CustomerRefundID",
                table: "Customer_Order_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Order_Line_Fixed_Product_FixedProductID",
                table: "Customer_Order_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Refund_Customer_Refund_Reason_CustomerRefundReasonID",
                table: "Customer_Refund");

            migrationBuilder.DropForeignKey(
                name: "FK_Employee_User_UserID",
                table: "Employee");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Estimate_Duration_EstimateDurationID",
                table: "Estimate");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Estimate_Status_EstimateStatusID",
                table: "Estimate");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Line_Admin_AdminID",
                table: "Estimate_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Line_Customer_CustomerID",
                table: "Estimate_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Estimate_Line_Estimate_EstimateID",
                table: "Estimate_Line");

            migrationBuilder.DropForeignKey(
                name: "FK_Fixed_Product_Product_Item_ItemID",
                table: "Fixed_Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Fixed_Product_QR_Code_QRCodeID",
                table: "Fixed_Product");

            migrationBuilder.DropForeignKey(
                name: "FK_Fixed_Product_Size_SizeID",
                table: "Fixed_Product");

            migrationBuilder.DropForeignKey(
                name: "FK_FixedProductSize_Fixed_Product_FixedProductID",
                table: "FixedProductSize");

            migrationBuilder.DropForeignKey(
                name: "FK_FixedProductSize_Size_SizeID",
                table: "FixedProductSize");

            migrationBuilder.DropForeignKey(
                name: "FK_Order_Delivery_Schedule_Employee_EmployeeID",
                table: "Order_Delivery_Schedule");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Customer_CustomerID",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Payment_Type_PaymentTypeID",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_Item_Product_Category_CategoryID",
                table: "Product_Item");

            migrationBuilder.DropForeignKey(
                name: "FK_Raw_Material_QR_Code_QRCodeID",
                table: "Raw_Material");

            migrationBuilder.DropForeignKey(
                name: "FK_Stock_Take_Employee_EmployeeID",
                table: "Stock_Take");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_Fixed_Product_UserID",
                table: "Supplier");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_Order_Supplier_SupplierID",
                table: "Supplier_Order");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLine_Fixed_Product_FixedProductID",
                table: "Supplier_OrderLine");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLine_Raw_Material_RawMaterialID",
                table: "Supplier_OrderLine");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLine_Supplier_Order_SupplierOrderID",
                table: "Supplier_OrderLine");

            migrationBuilder.DropForeignKey(
                name: "FK_Supplier_OrderLine_Supplier_Return_SupplierReturnID",
                table: "Supplier_OrderLine");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_RoleID",
                table: "User");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Permission_Role_RoleId",
                table: "User_Role_Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Role_Permission_User_Permission_UserPermissionID",
                table: "User_Role_Permission");

            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_QR_Code_QRCodeID",
                table: "Write_Off");

            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_Stock_Take_StockTakeID",
                table: "Write_Off");

            migrationBuilder.DropForeignKey(
                name: "FK_Write_Off_Write_Off_Reason_WriteOffReasonID",
                table: "Write_Off");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Write_Off_Reason",
                table: "Write_Off_Reason");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Write_Off",
                table: "Write_Off");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VAT",
                table: "VAT");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Role_Permission",
                table: "User_Role_Permission");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User_Permission",
                table: "User_Permission");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User",
                table: "User");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Supplier_Return",
                table: "Supplier_Return");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Supplier_OrderLine",
                table: "Supplier_OrderLine");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Supplier_Order",
                table: "Supplier_Order");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Supplier",
                table: "Supplier");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Stock_Take",
                table: "Stock_Take");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Size",
                table: "Size");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Role",
                table: "Role");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Raw_Material",
                table: "Raw_Material");

            migrationBuilder.DropPrimaryKey(
                name: "PK_QR_Code",
                table: "QR_Code");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Product_Item",
                table: "Product_Item");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Product_Category",
                table: "Product_Category");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Payment_Type",
                table: "Payment_Type");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Payment",
                table: "Payment");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Order_Delivery_Schedule",
                table: "Order_Delivery_Schedule");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FixedProductSize",
                table: "FixedProductSize");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Fixed_Price",
                table: "Fixed_Price");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimate_Status",
                table: "Estimate_Status");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimate_Line",
                table: "Estimate_Line");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimate_Duration",
                table: "Estimate_Duration");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Estimate",
                table: "Estimate");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Employee",
                table: "Employee");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Discount",
                table: "Discount");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Review",
                table: "Customer_Review");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Refund_Reason",
                table: "Customer_Refund_Reason");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Refund",
                table: "Customer_Refund");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Order_Status",
                table: "Customer_Order_Status");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Order_Line",
                table: "Customer_Order_Line");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer_Order",
                table: "Customer_Order");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Customer",
                table: "Customer");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Custom_Product",
                table: "Custom_Product");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Credit_Application_Status",
                table: "Credit_Application_Status");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Credit_Application",
                table: "Credit_Application");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Audit_Trail",
                table: "Audit_Trail");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Admin",
                table: "Admin");

            migrationBuilder.RenameTable(
                name: "Write_Off_Reason",
                newName: "Write_Off_Reasons");

            migrationBuilder.RenameTable(
                name: "Write_Off",
                newName: "Write_Offs");

            migrationBuilder.RenameTable(
                name: "VAT",
                newName: "VATs");

            migrationBuilder.RenameTable(
                name: "User_Role_Permission",
                newName: "User_Role_Permissions");

            migrationBuilder.RenameTable(
                name: "User_Permission",
                newName: "User_Permissions");

            migrationBuilder.RenameTable(
                name: "User",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "Supplier_Return",
                newName: "Supplier_Returns");

            migrationBuilder.RenameTable(
                name: "Supplier_OrderLine",
                newName: "Supplier_OrderLines");

            migrationBuilder.RenameTable(
                name: "Supplier_Order",
                newName: "Supplier_Orders");

            migrationBuilder.RenameTable(
                name: "Supplier",
                newName: "Suppliers");

            migrationBuilder.RenameTable(
                name: "Stock_Take",
                newName: "Stock_Takes");

            migrationBuilder.RenameTable(
                name: "Size",
                newName: "Sizes");

            migrationBuilder.RenameTable(
                name: "Role",
                newName: "Roles");

            migrationBuilder.RenameTable(
                name: "Raw_Material",
                newName: "Raw_Materials");

            migrationBuilder.RenameTable(
                name: "QR_Code",
                newName: "QR_Codes");

            migrationBuilder.RenameTable(
                name: "Product_Item",
                newName: "Product_Items");

            migrationBuilder.RenameTable(
                name: "Product_Category",
                newName: "Product_Categories");

            migrationBuilder.RenameTable(
                name: "Payment_Type",
                newName: "Payment_Types");

            migrationBuilder.RenameTable(
                name: "Payment",
                newName: "Payments");

            migrationBuilder.RenameTable(
                name: "Order_Delivery_Schedule",
                newName: "Order_Delivery_Schedules");

            migrationBuilder.RenameTable(
                name: "FixedProductSize",
                newName: "FixedProductSizes");

            migrationBuilder.RenameTable(
                name: "Fixed_Price",
                newName: "Fixed_Prices");

            migrationBuilder.RenameTable(
                name: "Estimate_Status",
                newName: "Estimate_Statuses");

            migrationBuilder.RenameTable(
                name: "Estimate_Line",
                newName: "Estimate_Lines");

            migrationBuilder.RenameTable(
                name: "Estimate_Duration",
                newName: "Estimate_Durations");

            migrationBuilder.RenameTable(
                name: "Estimate",
                newName: "Estimates");

            migrationBuilder.RenameTable(
                name: "Employee",
                newName: "Employees");

            migrationBuilder.RenameTable(
                name: "Discount",
                newName: "Discounts");

            migrationBuilder.RenameTable(
                name: "Customer_Review",
                newName: "Customer_Reviews");

            migrationBuilder.RenameTable(
                name: "Customer_Refund_Reason",
                newName: "Customer_Refund_Reasons");

            migrationBuilder.RenameTable(
                name: "Customer_Refund",
                newName: "Customer_Refunds");

            migrationBuilder.RenameTable(
                name: "Customer_Order_Status",
                newName: "Customer_Order_Statuses");

            migrationBuilder.RenameTable(
                name: "Customer_Order_Line",
                newName: "Customer_Order_Lines");

            migrationBuilder.RenameTable(
                name: "Customer_Order",
                newName: "Customer_Orders");

            migrationBuilder.RenameTable(
                name: "Customer",
                newName: "Customers");

            migrationBuilder.RenameTable(
                name: "Custom_Product",
                newName: "Custom_Products");

            migrationBuilder.RenameTable(
                name: "Credit_Application_Status",
                newName: "Credit_Application_Statuses");

            migrationBuilder.RenameTable(
                name: "Credit_Application",
                newName: "Credit_Applications");

            migrationBuilder.RenameTable(
                name: "Audit_Trail",
                newName: "Audit_Trails");

            migrationBuilder.RenameTable(
                name: "Admin",
                newName: "Admins");

            migrationBuilder.RenameIndex(
                name: "IX_Write_Off_WriteOffReasonID",
                table: "Write_Offs",
                newName: "IX_Write_Offs_WriteOffReasonID");

            migrationBuilder.RenameIndex(
                name: "IX_Write_Off_StockTakeID",
                table: "Write_Offs",
                newName: "IX_Write_Offs_StockTakeID");

            migrationBuilder.RenameIndex(
                name: "IX_Write_Off_QRCodeID",
                table: "Write_Offs",
                newName: "IX_Write_Offs_QRCodeID");

            migrationBuilder.RenameIndex(
                name: "IX_User_Role_Permission_UserPermissionID",
                table: "User_Role_Permissions",
                newName: "IX_User_Role_Permissions_UserPermissionID");

            migrationBuilder.RenameIndex(
                name: "IX_User_RoleID",
                table: "Users",
                newName: "IX_Users_RoleID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_OrderLine_SupplierReturnID",
                table: "Supplier_OrderLines",
                newName: "IX_Supplier_OrderLines_SupplierReturnID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_OrderLine_RawMaterialID",
                table: "Supplier_OrderLines",
                newName: "IX_Supplier_OrderLines_RawMaterialID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_OrderLine_FixedProductID",
                table: "Supplier_OrderLines",
                newName: "IX_Supplier_OrderLines_FixedProductID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_Order_SupplierID",
                table: "Supplier_Orders",
                newName: "IX_Supplier_Orders_SupplierID");

            migrationBuilder.RenameIndex(
                name: "IX_Supplier_UserID",
                table: "Suppliers",
                newName: "IX_Suppliers_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Stock_Take_EmployeeID",
                table: "Stock_Takes",
                newName: "IX_Stock_Takes_EmployeeID");

            migrationBuilder.RenameIndex(
                name: "IX_Raw_Material_QRCodeID",
                table: "Raw_Materials",
                newName: "IX_Raw_Materials_QRCodeID");

            migrationBuilder.RenameIndex(
                name: "IX_Product_Item_CategoryID",
                table: "Product_Items",
                newName: "IX_Product_Items_CategoryID");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_PaymentTypeID",
                table: "Payments",
                newName: "IX_Payments_PaymentTypeID");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_CustomerID",
                table: "Payments",
                newName: "IX_Payments_CustomerID");

            migrationBuilder.RenameIndex(
                name: "IX_Order_Delivery_Schedule_EmployeeID",
                table: "Order_Delivery_Schedules",
                newName: "IX_Order_Delivery_Schedules_EmployeeID");

            migrationBuilder.RenameIndex(
                name: "IX_FixedProductSize_SizeID",
                table: "FixedProductSizes",
                newName: "IX_FixedProductSizes_SizeID");

            migrationBuilder.RenameIndex(
                name: "IX_FixedProductSize_FixedProductID",
                table: "FixedProductSizes",
                newName: "IX_FixedProductSizes_FixedProductID");

            migrationBuilder.RenameIndex(
                name: "IX_Estimate_Line_EstimateID",
                table: "Estimate_Lines",
                newName: "IX_Estimate_Lines_EstimateID");

            migrationBuilder.RenameIndex(
                name: "IX_Estimate_Line_AdminID",
                table: "Estimate_Lines",
                newName: "IX_Estimate_Lines_AdminID");

            migrationBuilder.RenameIndex(
                name: "IX_Estimate_EstimateStatusID",
                table: "Estimates",
                newName: "IX_Estimates_EstimateStatusID");

            migrationBuilder.RenameIndex(
                name: "IX_Estimate_EstimateDurationID",
                table: "Estimates",
                newName: "IX_Estimates_EstimateDurationID");

            migrationBuilder.RenameIndex(
                name: "IX_Employee_UserID",
                table: "Employees",
                newName: "IX_Employees_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Refund_CustomerRefundReasonID",
                table: "Customer_Refunds",
                newName: "IX_Customer_Refunds_CustomerRefundReasonID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Order_Line_FixedProductID",
                table: "Customer_Order_Lines",
                newName: "IX_Customer_Order_Lines_FixedProductID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Order_Line_CustomProductID",
                table: "Customer_Order_Lines",
                newName: "IX_Customer_Order_Lines_CustomProductID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Order_Line_CustomerRefundID",
                table: "Customer_Order_Lines",
                newName: "IX_Customer_Order_Lines_CustomerRefundID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Order_OrderDeliveryScheduleID",
                table: "Customer_Orders",
                newName: "IX_Customer_Orders_OrderDeliveryScheduleID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Order_CustomerOrderStatusID",
                table: "Customer_Orders",
                newName: "IX_Customer_Orders_CustomerOrderStatusID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_Order_CustomerID",
                table: "Customer_Orders",
                newName: "IX_Customer_Orders_CustomerID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_UserID",
                table: "Customers",
                newName: "IX_Customers_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Customer_EmployeeID",
                table: "Customers",
                newName: "IX_Customers_EmployeeID");

            migrationBuilder.RenameIndex(
                name: "IX_Custom_Product_ItemID",
                table: "Custom_Products",
                newName: "IX_Custom_Products_ItemID");

            migrationBuilder.RenameIndex(
                name: "IX_Custom_Product_FormulaID",
                table: "Custom_Products",
                newName: "IX_Custom_Products_FormulaID");

            migrationBuilder.RenameIndex(
                name: "IX_Credit_Application_CustomerID",
                table: "Credit_Applications",
                newName: "IX_Credit_Applications_CustomerID");

            migrationBuilder.RenameIndex(
                name: "IX_Credit_Application_CreditApplicationStatusID",
                table: "Credit_Applications",
                newName: "IX_Credit_Applications_CreditApplicationStatusID");

            migrationBuilder.RenameIndex(
                name: "IX_Credit_Application_AdminID",
                table: "Credit_Applications",
                newName: "IX_Credit_Applications_AdminID");

            migrationBuilder.RenameIndex(
                name: "IX_Admin_UserID",
                table: "Admins",
                newName: "IX_Admins_UserID");

            migrationBuilder.AddColumn<int>(
                name: "Date",
                table: "cost_Price_Formula_Variables",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AdminID",
                table: "Write_Offs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AdminID",
                table: "QR_Codes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AdminID",
                table: "Product_Categories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Write_Off_Reasons",
                table: "Write_Off_Reasons",
                column: "WriteOffReasonID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Write_Offs",
                table: "Write_Offs",
                column: "WriteOffID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VATs",
                table: "VATs",
                column: "VatID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Role_Permissions",
                table: "User_Role_Permissions",
                columns: new[] { "RoleId", "UserPermissionID" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_User_Permissions",
                table: "User_Permissions",
                column: "UserPermissionID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "UserID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Supplier_Returns",
                table: "Supplier_Returns",
                column: "SupplierReturnID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Supplier_OrderLines",
                table: "Supplier_OrderLines",
                columns: new[] { "SupplierOrderID", "FixedProductID", "RawMaterialID" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Supplier_Orders",
                table: "Supplier_Orders",
                column: "SupplierOrderID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Suppliers",
                table: "Suppliers",
                column: "SupplierID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Stock_Takes",
                table: "Stock_Takes",
                column: "StockTakeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Sizes",
                table: "Sizes",
                column: "SizeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Roles",
                table: "Roles",
                column: "RoleID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Raw_Materials",
                table: "Raw_Materials",
                column: "RawMaterialID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_QR_Codes",
                table: "QR_Codes",
                column: "QRCodeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Product_Items",
                table: "Product_Items",
                column: "ItemID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Product_Categories",
                table: "Product_Categories",
                column: "CategoryID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payment_Types",
                table: "Payment_Types",
                column: "PaymentTypeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payments",
                table: "Payments",
                column: "PaymentID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Order_Delivery_Schedules",
                table: "Order_Delivery_Schedules",
                column: "OrderDeliveryScheduleID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FixedProductSizes",
                table: "FixedProductSizes",
                column: "FixedProductSizeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Fixed_Prices",
                table: "Fixed_Prices",
                column: "PriceID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimate_Statuses",
                table: "Estimate_Statuses",
                column: "EstimateStatusID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimate_Lines",
                table: "Estimate_Lines",
                columns: new[] { "CustomerID", "EstimateID" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimate_Durations",
                table: "Estimate_Durations",
                column: "EstimateDurationID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Estimates",
                table: "Estimates",
                column: "EstimateID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Employees",
                table: "Employees",
                column: "EmployeeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Discounts",
                table: "Discounts",
                column: "DiscountID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Reviews",
                table: "Customer_Reviews",
                column: "CustomerReviewID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Refund_Reasons",
                table: "Customer_Refund_Reasons",
                column: "CustomerRefundReasonID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Refunds",
                table: "Customer_Refunds",
                column: "CustomerRefundID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Order_Statuses",
                table: "Customer_Order_Statuses",
                column: "CustomerOrderStatusID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Order_Lines",
                table: "Customer_Order_Lines",
                columns: new[] { "CustomerOrderID", "FixedProductID", "CustomProductID" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customer_Orders",
                table: "Customer_Orders",
                column: "CustomerOrderID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Customers",
                table: "Customers",
                column: "customerID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Custom_Products",
                table: "Custom_Products",
                column: "CustomProductID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Credit_Application_Statuses",
                table: "Credit_Application_Statuses",
                column: "CreditApplicationStatusID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Credit_Applications",
                table: "Credit_Applications",
                column: "creditApplicationID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Audit_Trails",
                table: "Audit_Trails",
                column: "AuditTrailID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Admins",
                table: "Admins",
                column: "AdminID");

            migrationBuilder.CreateIndex(
                name: "IX_Write_Offs_AdminID",
                table: "Write_Offs",
                column: "AdminID");

            migrationBuilder.CreateIndex(
                name: "IX_QR_Codes_AdminID",
                table: "QR_Codes",
                column: "AdminID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_Categories_AdminID",
                table: "Product_Categories",
                column: "AdminID");

            migrationBuilder.AddForeignKey(
                name: "FK_Admins_Users_UserID",
                table: "Admins",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Credit_Applications_Admins_AdminID",
                table: "Credit_Applications",
                column: "AdminID",
                principalTable: "Admins",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Credit_Applications_Credit_Application_Statuses_CreditApplicationStatusID",
                table: "Credit_Applications",
                column: "CreditApplicationStatusID",
                principalTable: "Credit_Application_Statuses",
                principalColumn: "CreditApplicationStatusID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Credit_Applications_Customers_CustomerID",
                table: "Credit_Applications",
                column: "CustomerID",
                principalTable: "Customers",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Custom_Products_cost_Price_Formula_Variables_FormulaID",
                table: "Custom_Products",
                column: "FormulaID",
                principalTable: "cost_Price_Formula_Variables",
                principalColumn: "FormulaID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Custom_Products_Product_Items_ItemID",
                table: "Custom_Products",
                column: "ItemID",
                principalTable: "Product_Items",
                principalColumn: "ItemID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Lines_Custom_Products_CustomProductID",
                table: "Customer_Order_Lines",
                column: "CustomProductID",
                principalTable: "Custom_Products",
                principalColumn: "CustomProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Lines_Customer_Orders_CustomerOrderID",
                table: "Customer_Order_Lines",
                column: "CustomerOrderID",
                principalTable: "Customer_Orders",
                principalColumn: "CustomerOrderID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Lines_Customer_Refunds_CustomerRefundID",
                table: "Customer_Order_Lines",
                column: "CustomerRefundID",
                principalTable: "Customer_Refunds",
                principalColumn: "CustomerRefundID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Order_Lines_Fixed_Product_FixedProductID",
                table: "Customer_Order_Lines",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Orders_Customer_Order_Statuses_CustomerOrderStatusID",
                table: "Customer_Orders",
                column: "CustomerOrderStatusID",
                principalTable: "Customer_Order_Statuses",
                principalColumn: "CustomerOrderStatusID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Orders_Customers_CustomerID",
                table: "Customer_Orders",
                column: "CustomerID",
                principalTable: "Customers",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Orders_Order_Delivery_Schedules_OrderDeliveryScheduleID",
                table: "Customer_Orders",
                column: "OrderDeliveryScheduleID",
                principalTable: "Order_Delivery_Schedules",
                principalColumn: "OrderDeliveryScheduleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Refunds_Customer_Refund_Reasons_CustomerRefundReasonID",
                table: "Customer_Refunds",
                column: "CustomerRefundReasonID",
                principalTable: "Customer_Refund_Reasons",
                principalColumn: "CustomerRefundReasonID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Employees_EmployeeID",
                table: "Customers",
                column: "EmployeeID",
                principalTable: "Employees",
                principalColumn: "EmployeeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Users_UserID",
                table: "Customers",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Users_UserID",
                table: "Employees",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Lines_Admins_AdminID",
                table: "Estimate_Lines",
                column: "AdminID",
                principalTable: "Admins",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Lines_Customers_CustomerID",
                table: "Estimate_Lines",
                column: "CustomerID",
                principalTable: "Customers",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimate_Lines_Estimates_EstimateID",
                table: "Estimate_Lines",
                column: "EstimateID",
                principalTable: "Estimates",
                principalColumn: "EstimateID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimates_Estimate_Durations_EstimateDurationID",
                table: "Estimates",
                column: "EstimateDurationID",
                principalTable: "Estimate_Durations",
                principalColumn: "EstimateDurationID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Estimates_Estimate_Statuses_EstimateStatusID",
                table: "Estimates",
                column: "EstimateStatusID",
                principalTable: "Estimate_Statuses",
                principalColumn: "EstimateStatusID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Fixed_Product_Product_Items_ItemID",
                table: "Fixed_Product",
                column: "ItemID",
                principalTable: "Product_Items",
                principalColumn: "ItemID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Fixed_Product_QR_Codes_QRCodeID",
                table: "Fixed_Product",
                column: "QRCodeID",
                principalTable: "QR_Codes",
                principalColumn: "QRCodeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Fixed_Product_Sizes_SizeID",
                table: "Fixed_Product",
                column: "SizeID",
                principalTable: "Sizes",
                principalColumn: "SizeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FixedProductSizes_Fixed_Product_FixedProductID",
                table: "FixedProductSizes",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FixedProductSizes_Sizes_SizeID",
                table: "FixedProductSizes",
                column: "SizeID",
                principalTable: "Sizes",
                principalColumn: "SizeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Order_Delivery_Schedules_Employees_EmployeeID",
                table: "Order_Delivery_Schedules",
                column: "EmployeeID",
                principalTable: "Employees",
                principalColumn: "EmployeeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Customers_CustomerID",
                table: "Payments",
                column: "CustomerID",
                principalTable: "Customers",
                principalColumn: "customerID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Payment_Types_PaymentTypeID",
                table: "Payments",
                column: "PaymentTypeID",
                principalTable: "Payment_Types",
                principalColumn: "PaymentTypeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Product_Categories_Admins_AdminID",
                table: "Product_Categories",
                column: "AdminID",
                principalTable: "Admins",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Product_Items_Product_Categories_CategoryID",
                table: "Product_Items",
                column: "CategoryID",
                principalTable: "Product_Categories",
                principalColumn: "CategoryID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_QR_Codes_Admins_AdminID",
                table: "QR_Codes",
                column: "AdminID",
                principalTable: "Admins",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Raw_Materials_QR_Codes_QRCodeID",
                table: "Raw_Materials",
                column: "QRCodeID",
                principalTable: "QR_Codes",
                principalColumn: "QRCodeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Stock_Takes_Employees_EmployeeID",
                table: "Stock_Takes",
                column: "EmployeeID",
                principalTable: "Employees",
                principalColumn: "EmployeeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLines_Fixed_Product_FixedProductID",
                table: "Supplier_OrderLines",
                column: "FixedProductID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLines_Raw_Materials_RawMaterialID",
                table: "Supplier_OrderLines",
                column: "RawMaterialID",
                principalTable: "Raw_Materials",
                principalColumn: "RawMaterialID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLines_Supplier_Orders_SupplierOrderID",
                table: "Supplier_OrderLines",
                column: "SupplierOrderID",
                principalTable: "Supplier_Orders",
                principalColumn: "SupplierOrderID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_OrderLines_Supplier_Returns_SupplierReturnID",
                table: "Supplier_OrderLines",
                column: "SupplierReturnID",
                principalTable: "Supplier_Returns",
                principalColumn: "SupplierReturnID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Supplier_Orders_Suppliers_SupplierID",
                table: "Supplier_Orders",
                column: "SupplierID",
                principalTable: "Suppliers",
                principalColumn: "SupplierID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Suppliers_Fixed_Product_UserID",
                table: "Suppliers",
                column: "UserID",
                principalTable: "Fixed_Product",
                principalColumn: "FixedProductID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_Permissions_Roles_RoleId",
                table: "User_Role_Permissions",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "RoleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_User_Role_Permissions_User_Permissions_UserPermissionID",
                table: "User_Role_Permissions",
                column: "UserPermissionID",
                principalTable: "User_Permissions",
                principalColumn: "UserPermissionID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleID",
                table: "Users",
                column: "RoleID",
                principalTable: "Roles",
                principalColumn: "RoleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Offs_Admins_AdminID",
                table: "Write_Offs",
                column: "AdminID",
                principalTable: "Admins",
                principalColumn: "AdminID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Offs_QR_Codes_QRCodeID",
                table: "Write_Offs",
                column: "QRCodeID",
                principalTable: "QR_Codes",
                principalColumn: "QRCodeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Offs_Stock_Takes_StockTakeID",
                table: "Write_Offs",
                column: "StockTakeID",
                principalTable: "Stock_Takes",
                principalColumn: "StockTakeID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Write_Offs_Write_Off_Reasons_WriteOffReasonID",
                table: "Write_Offs",
                column: "WriteOffReasonID",
                principalTable: "Write_Off_Reasons",
                principalColumn: "WriteOffReasonID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
