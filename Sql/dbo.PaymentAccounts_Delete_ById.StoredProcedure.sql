USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[PaymentAccounts_Delete_ById]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[PaymentAccounts_Delete_ById]
		@Id int

/*

	DECLARE @Id int = 5

	SELECT *
	FROM dbo.PaymentAccounts
	WHERE Id = @Id;

	EXECUTE dbo.PaymentAccounts_Delete_ById
				@Id

	SELECT *
	FROM dbo.PaymentAccounts
	WHERE Id = @Id;

*/

AS 

BEGIN

	DELETE FROM dbo.PaymentAccounts
	WHERE [Id] = @Id;

END
GO
