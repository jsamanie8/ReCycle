USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[PaymentAccounts_Select_ById]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[PaymentAccounts_Select_ById]
		@Id int


/*

	DECLARE @Id int = 1;

	EXECUTE dbo.PaymentAccounts_Select_ById
					@Id
*/

AS

BEGIN

	SELECT [Id]
		  ,[VendorId]
		  ,[AccountId]
		  ,[PaymentTypeId]
		  ,[DateCreated]
		  ,[DateModified]
		  ,[CreatedBy]
		  ,[ModifiedBy]
	FROM dbo.PaymentAccounts
	WHERE [Id] = @Id

END
GO
