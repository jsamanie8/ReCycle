USE [C76_Recycle]
GO
/****** Object:  StoredProcedure [dbo].[ProductConditionTypes_SelectAll]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE proc [dbo].[ProductConditionTypes_SelectAll]


/*

Declare 
	
		Execute  [dbo].[ProductConditionTypes_SelectAll]

*/

as 

BEGIN

		Select   [Id]
				,[Name]
			FROM [dbo].[ProductConditionTypes]


END
GO
