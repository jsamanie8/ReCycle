USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[PaymentAccounts_SelectAll]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[PaymentAccounts_SelectAll]
		@pageIndex int
		,@pageSize int

/*

	DECLARE @pageIndex int = 0
			,@pageSize int = 10

	EXECUTE dbo.PaymentAccounts_SelectAll
			@pageIndex
			,@pageSize

*/

AS

BEGIN

	DECLARE @offset int = @pageIndex * @pageSize

	SELECT [Id]
		  ,[VendorId]
		  ,[AccountId]
		  ,[PaymentTypeId]
		  ,[DateCreated]
		  ,[DateModified]
		  ,[CreatedBy]
		  ,[ModifiedBy]
		  ,[TotalCount] = COUNT(1) OVER()
	FROM dbo.PaymentAccounts
	ORDER BY DateCreated DESC

	OFFSET @offSet ROWS
	FETCH NEXT @pageSize ROWS Only

END
GO
