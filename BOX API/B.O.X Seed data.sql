USE [BOX]
GO

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