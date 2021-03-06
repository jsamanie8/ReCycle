USE [C76_Recycle]
GO
/****** Object:  Table [dbo].[PaymentAccounts]    Script Date: 9/16/2019 9:43:26 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaymentAccounts](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VendorId] [int] NOT NULL,
	[AccountId] [nvarchar](250) NOT NULL,
	[PaymentTypeId] [int] NOT NULL,
	[DateCreated] [datetime2](7) NOT NULL,
	[DateModified] [datetime2](7) NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifiedBy] [int] NULL,
 CONSTRAINT [PK_PaymentAccounts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[PaymentAccounts] ADD  CONSTRAINT [DF_PaymentAccounts_DateCreated]  DEFAULT (getutcdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[PaymentAccounts] ADD  CONSTRAINT [DF_PaymentAccounts_DateModified]  DEFAULT (getutcdate()) FOR [DateModified]
GO
ALTER TABLE [dbo].[PaymentAccounts]  WITH CHECK ADD  CONSTRAINT [FK_PaymentAccounts_PaymentTypes_PaymentTypeId] FOREIGN KEY([PaymentTypeId])
REFERENCES [dbo].[PaymentTypes] ([Id])
GO
ALTER TABLE [dbo].[PaymentAccounts] CHECK CONSTRAINT [FK_PaymentAccounts_PaymentTypes_PaymentTypeId]
GO
ALTER TABLE [dbo].[PaymentAccounts]  WITH CHECK ADD  CONSTRAINT [FK_PaymentAccounts_Users_CreatedBy] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[PaymentAccounts] CHECK CONSTRAINT [FK_PaymentAccounts_Users_CreatedBy]
GO
ALTER TABLE [dbo].[PaymentAccounts]  WITH CHECK ADD  CONSTRAINT [FK_PaymentAccounts_Users_ModifiedBy] FOREIGN KEY([ModifiedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[PaymentAccounts] CHECK CONSTRAINT [FK_PaymentAccounts_Users_ModifiedBy]
GO
ALTER TABLE [dbo].[PaymentAccounts]  WITH CHECK ADD  CONSTRAINT [FK_PaymentAccounts_Vendors_VendorId] FOREIGN KEY([VendorId])
REFERENCES [dbo].[Vendors] ([Id])
GO
ALTER TABLE [dbo].[PaymentAccounts] CHECK CONSTRAINT [FK_PaymentAccounts_Vendors_VendorId]
GO
