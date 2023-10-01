USE [BOX]
GO

--Step 1:
DROP INDEX IX_Customer_EmployeeId ON [BOX].[dbo].[Customer];

--Step 2:
ALTER TABLE [BOX].[dbo].[Customer]
DROP CONSTRAINT FK_Customer_Employee_EmployeeId;

--Step 3:
ALTER TABLE [BOX].[dbo].[Customer]
ALTER COLUMN [EmployeeId] NVARCHAR(50) NULL;

--Step 4:
CREATE INDEX IX_Customer_EmployeeId ON [BOX].[dbo].[Customer] ([EmployeeId]);

--Step 1:
DROP INDEX IX_Customer_TitleId ON [BOX].[dbo].[Customer];

--Step 2:
ALTER TABLE [BOX].[dbo].[Customer]
DROP CONSTRAINT FK_Customer_Title_TitleId;

--Step 3:
ALTER TABLE [BOX].[dbo].[Customer]
ALTER COLUMN [TitleId] NVARCHAR(50) NULL;

--Step 4:
CREATE INDEX IX_Customer_TitleId ON [BOX].[dbo].[Customer] ([TitleId]);

INSERT INTO [dbo].[Customer_Order_Status]
           ([Description])
     VALUES
           ('Placed'),
           ('In progress'),
           ('Cancelled'),
           ('Ready for delivery'),
           ('Out for delivery'),
           ('Completed')
GO

INSERT INTO [dbo].[Quote_Duration]
           ([Duration])
     VALUES
           (30)
GO

INSERT INTO [dbo].[Quote_Status]
           ([Description])
     VALUES
           ('Generated'),
           ('Accepted'),
           ('Rejected'),
           ('Rejected and will renegotiate'),
           ('Expired'),
		   ('Rejected; Successfully renegotiated')
GO

INSERT INTO [dbo].[Quote_Request_Status]
           ([Description])
     VALUES
           ('Requested'),
           ('Completed')
GO

INSERT INTO [dbo].[VAT]
           ([Percentage]
           ,[Date])
     VALUES
           (15, '2023-08-09')
GO

INSERT INTO [dbo].[Bulk_Discount]
           ([Percentage]
           ,[Quantity])
     VALUES
           (1, 1000),
           (2, 5000),
           (3, 10000),
           (5, 50000)
GO

INSERT INTO [dbo].[cost_Price_Formula_Variables]
           ([Description]
           ,[Box_Factor]
           ,[Rate_Per_Ton]
           ,[Factory_Cost]
           ,[Mark_Up])
     VALUES
           ('Single Wall Carton', 50, 20, 10, 30),
           ('Double Wall Carton', 70, 20, 10, 30)
GO

INSERT INTO [dbo].[Reject_Reason]
           ([Description])
     VALUES
           ('I got a better price elsewhere. Can you beat it?'),
           ('I got a better price elsewhere.'),
           ('I don''t want these products anymore.'),
           ('Other')
GO

INSERT INTO [dbo].[Title]
           ([Description])
     VALUES
           ('Mr'),
           ('Ms'),
           ('Mrs'),
           ('Prof'),
           ('Dr')
GO

INSERT INTO [dbo].[Delivery_Type]
           ([Description])
     VALUES
           ('Delivery'),
           ('Pick up')
GO

INSERT INTO [dbo].[Payment_Type]
           ([Description])
     VALUES
           ('Pay immediately'),
           ('Cash on delivery / collection'),
           ('Credit')
GO

INSERT INTO [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp])
VALUES
    (NEWID(), 'Administrator', 'ADMINISTRATOR', NEWID()),
    (NEWID(), 'Employee', 'EMPLOYEE', NEWID()),
    (NEWID(), 'Customer', 'CUSTOMER', NEWID()),
    (NEWID(), 'Receptionist', 'RECEPTIONIST', NEWID()),
    (NEWID(), 'Delivery Driver', 'DELIVERY DRIVER', NEWID()),
    (NEWID(), 'Warehouse Staff', 'WAREHOUSE STAFF', NEWID()),
    (NEWID(), 'Manager', 'MANAGER', NEWID())
GO


INSERT INTO [dbo].[Credit_Application_Status]
           ([Description])
     VALUES
           ('Submitted'),
		   ('Accepted'),
		   ('Rejected')
GO
SELECT name
FROM sys.tables

select * from vat
select * from title
select * from reject_reason
select * from quote_status
select * from quote_duration
select * from payment_type
select * from customer_order_status
select * from credit_application_status
select * from cost_price_formula_variables
select * from bulk_discount
select * from delivery_type