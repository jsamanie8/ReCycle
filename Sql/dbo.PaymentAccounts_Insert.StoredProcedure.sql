USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[PaymentAccounts_Insert]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[PaymentAccounts_Insert]

			@VendorId int,
			@AccountId nvarchar(250),
			@PaymentTypeId int,
			@CreatedBy int,
			@ModifiedBy int,
			@Id int OUTPUT


/*

	DECLARE @Id int;

	DECLARE @VendorId int = 1,
			@AccountId nvarchar(250) = '12345',
			@PaymentTypeId int = 1,
			@CreatedBy int = 1,
			@ModifiedBy int = 1

	EXECUTE dbo.PaymentAccounts_Insert
										@VendorId,
										@AccountId, 
										@PaymentTypeId, 
										@CreatedBy, 
										@ModifiedBy, 
										@Id OUTPUT

	SELECT @Id

	SELECT *
	FROM dbo.PaymentAccounts
	Where Id = @Id

*/

AS

BEGIN

	INSERT INTO dbo.PaymentAccounts
			([VendorId]
			,[AccountId]
			,[PaymentTypeId]
			,[CreatedBy]
			,[ModifiedBy])
	VALUES
			(@VendorId
			,@AccountId
			,@PaymentTypeId
			,@CreatedBy
			,@ModifiedBy)

	SET @Id = SCOPE_IDENTITY()

END
GO
