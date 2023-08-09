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
           (7)
GO

INSERT INTO [dbo].[Quote_Status]
           ([Description])
     VALUES
           ('Pending review'),
           ('Reviewed'),
           ('Cancelled'),
           ('Accepted'),
           ('Rejected'),
           ('Expired')
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
           ('Single Wall Carton', 30, 30, 45, 25),
           ('Double Wall Carton', 30, 30, 45, 25)
GO

INSERT INTO [dbo].[Reject_Reason]
           ([Description])
     VALUES
           ('I got a better price elsewhere. Can you beat that price?'),
           ('I got a better price elsewhere.'),
           ('I don''t want these products anymore.'),
           ('Other')
GO

INSERT INTO [dbo].[Title]
           ([Description])
     VALUES
           ('Mr'),
           ('Miss'),
           ('Ms'),
           ('Mrs'),
           ('Prof'),
           ('Dr')
GO