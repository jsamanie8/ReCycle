USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[PaymentAccounts_Select_ByCreatedBy]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[PaymentAccounts_Select_ByCreatedBy]
		@CreatedBy int
		,@pageIndex int
		,@pageSize int

/*

	DECLARE @CreatedBy int = 3
			,@pageIndex int = 0
			,@pageSize int = 10

	EXECUTE dbo.PaymentAccounts_Select_ByCreatedBy
			@CreatedBy
			,@pageIndex
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
		  
	From dbo.PaymentAccounts
	WHERE [CreatedBy] = @CreatedBy
	ORDER BY DateCreated DESC

	OFFSET @offSet ROWS
	FETCH NEXT @pageSize ROWS Only

END
GO
