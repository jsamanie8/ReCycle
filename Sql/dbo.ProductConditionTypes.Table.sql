USE [C76_Recycle]
GO
/****** Object:  Table [dbo].[ProductConditionTypes]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductConditionTypes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_ProductConditionTypes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ProductConditionTypes]  WITH CHECK ADD  CONSTRAINT [FK_ProductConditionTypes_ProductConditionTypes] FOREIGN KEY([Id])
REFERENCES [dbo].[ProductConditionTypes] ([Id])
GO
ALTER TABLE [dbo].[ProductConditionTypes] CHECK CONSTRAINT [FK_ProductConditionTypes_ProductConditionTypes]
GO
