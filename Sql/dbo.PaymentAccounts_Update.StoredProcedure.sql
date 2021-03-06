USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[PaymentAccounts_Update]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[PaymentAccounts_Update]
		
		@VendorId int,
		@AccountId nvarchar(250),
		@PaymentTypeId int,
		@CreatedBy int,
		@ModifiedBy int,
		@Id int



/*

	DECLARE @Id int = 5;

	DECLARE @VendorId int = 1,
			@AccountId nvarchar(250) = 'Here is an update for you.',
			@PaymentTypeId int = 1,
			@CreatedBy int = 3,
			@ModifiedBy int = 1
			

			SELECT *
			FROM dbo.PaymentAccounts
			WHERE Id = @Id

	EXECUTE dbo.PaymentAccounts_Update
			@VendorId,
			@AccountId,
			@PaymentTypeId,
			@CreatedBy,
			@ModifiedBy,
			@Id 

			SELECT *
			FROM dbo.PaymentAccounts
			WHERE Id = @Id

*/

AS

BEGIN

	DECLARE @dateNow datetime2 = getutcdate();

	UPDATE dbo.PaymentAccounts
	   SET [VendorId] = @VendorId
		  ,[AccountId] = @AccountId
		  ,[PaymentTypeId] = @PaymentTypeId
		  ,[DateModified] = @dateNow
		  ,[CreatedBy] = @CreatedBy
		  ,[ModifiedBy] = @ModifiedBy
	WHERE [Id] = @Id

END
GO
