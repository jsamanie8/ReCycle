USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[ProductType_SelectAll]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROC [dbo].[ProductType_SelectAll]

/*

	EXECUTE [dbo].[ProductType_SelectAll]

*/

AS

BEGIN

	SELECT [Id]
		  ,[Name]
		  ,[Description]
	FROM [dbo].[ProductType]

END

GO
