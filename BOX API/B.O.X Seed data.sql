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

INSERT INTO [dbo].[Estimate_Duration]
           ([Duration])
     VALUES
           (7)
GO

INSERT INTO [dbo].[Estimate_Status]
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
           ([Percentage])
     VALUES
           (15)
GO

INSERT INTO [dbo].[Discount]
           ([Percentage]
           ,[Quantity])
     VALUES
           (1 ,1000),
           (2 ,5000),
           (3 ,10000),
           (5 ,50000)
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