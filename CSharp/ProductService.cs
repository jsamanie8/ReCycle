using ReCycle.Data;
using ReCycle.Data.Providers;
using ReCycle.Models;
using ReCycle.Models.Domain;
using ReCycle.Models.Requests.Products;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace ReCycle.Services
{
    public class ProductService : IProductService
    {
        private IDataProvider _data = null;

        public ProductService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(ProductAddRequest model, int userId)
        {
            int id = 0;

            Guid guid = Guid.NewGuid();

            string procName = "[dbo].[Products_Insert]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@CreatedBy", userId);
                    col.AddWithValue("@SKU", guid);
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    Int32.TryParse(oId.ToString(), out id);
                });
            return id;
        }

        public void Update(ProductUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Products_Update]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@ModifiedBy", userId);
                    col.AddWithValue("@Id", model.Id);
                },
                returnParameters: null);
        }

        public Product Get(int id)
        {
            string procName = "[dbo].[Products_Select_ById_V2]";

            Product product = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                product = MapProduct(reader);
            }
            );
            return product;
        }

        public Paged<Product> Get(int pageIndex, int pageSize)
        {
            Paged<Product> pagedResult = null;

            List<Product> result = null;

            string procName = "[dbo].[Products_SelectAll_V2]";

            int totalCount = 0;

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Product product = MapProduct(reader);
                    if (totalCount == 0)
                    {                       
                        totalCount = reader.GetSafeInt32(20);
                    }

                    if (result == null)
                    {
                        result = new List<Product>();
                    }

                    result.Add(product);
                }
            );
            if (result != null)
            {
                pagedResult = new Paged<Product>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<Product> Get(int pageIndex, int pageSize, int createdBy)
        {
            Paged<Product> pagedList = null;

            List<Product> list = null;

            string procName = "[dbo].[Products_Select_ByCreatedBy_V2]";

            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@CreatedBy", createdBy);
                parameterCollection.AddWithValue("@PageIndex", pageIndex);
                parameterCollection.AddWithValue("@PageSize", pageSize);
            }, (reader, recordSetIndex) =>
            {
                Product product = MapProduct(reader);

                if (totalCount == 0)
                {                      
                    totalCount = reader.GetSafeInt32(20);
                }

                if (list == null)
                {
                    list = new List<Product>();
                }

                list.Add(product);
            });

            if (list != null)
            {
                pagedList = new Paged<Product>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Product> Filter(int pageIndex, int pageSize, int productTypeId, string material, string size, string color)
        {
            Paged<Product> pagedList = null;

            List<Product> list = null;

            string procName = "[dbo].[Products_Filter_MasterV2]";

            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@PageIndex", pageIndex);
                parameterCollection.AddWithValue("@PageSize", pageSize);
                parameterCollection.AddWithValue("@ProductTypeId", productTypeId);
                parameterCollection.AddWithValue("@Material", material);
                parameterCollection.AddWithValue("@Size", size);
                parameterCollection.AddWithValue("@Color", color);
            }, (reader, recordSetIndex) =>
            {
                Product product = MapFilter(reader);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(24);
                }

                if (list == null)
                {
                    list = new List<Product>();
                }

                list.Add(product);
            });

            if(list != null)
            {
                pagedList = new Paged<Product>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public List<ProductType> GetProductType()
        {
            List<ProductType> result = null;

            string procName = "[dbo].[ProductType_SelectAll]";

            _data.ExecuteCmd(procName,
                inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    ProductType aProductType = new ProductType();

                    int startingIndex = 0;

                    aProductType.Id = reader.GetSafeInt32(startingIndex++);
                    aProductType.Name = reader.GetSafeString(startingIndex++);
                    aProductType.Description = reader.GetSafeString(startingIndex++);

                    if (result == null)
                    {
                        result = new List<ProductType>();
                    }

                    result.Add(aProductType);
                }
            );

            return result;
        }

        public List<Top3Item> GetTop3Item()
        {
            List<Top3Item> result = null;

            string procName = "[dbo].[Products_Top3Items]";

            _data.ExecuteCmd(procName,
                inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Top3Item aTop3Item = new Top3Item();
                    int startingIndex = 0;
                    aTop3Item.InventoryId = reader.GetSafeInt32(startingIndex++);
                    aTop3Item.BasePrice = reader.GetDecimal(startingIndex++);
                    aTop3Item.ProductId = reader.GetSafeInt32(startingIndex++);
                    aTop3Item.Manufacturer = reader.GetSafeString(startingIndex++);
                    aTop3Item.Name = reader.GetSafeString(startingIndex++);
                    aTop3Item.Description = reader.GetSafeString(startingIndex++);
                    aTop3Item.PrimaryImage = reader.GetSafeString(startingIndex++);                    
                    if (result == null)
                    {
                        result = new List<Top3Item>();
                    }
                    result.Add(aTop3Item);
                }
            );

            return result;
        }
      
        public List<ConditionType> GetConditionType()
        {
            List<ConditionType> result = null;

            string procName = "[dbo].[ProductConditionTypes_SelectAll]";

            _data.ExecuteCmd(procName,
                inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    ConditionType aConditionType = new ConditionType();

                    int startingIndex = 0;

                    aConditionType.Id = reader.GetSafeInt32(startingIndex++);
                    aConditionType.Name = reader.GetSafeString(startingIndex++);

                    if (result == null)
                    {
                        result = new List<ConditionType>();
                    }

                    result.Add(aConditionType);
                }
            );

            return result;
        }

        public void Deactivate(int id, bool isActive)
        {
            string procName = "[dbo].[Products_UpdateStatus]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
                paramCollection.AddWithValue("@IsActive", isActive);
            });
        }

        public Paged<Seller> GetBySellerId(int pageIndex, int pageSize, int sellerId)
        {
            Paged<Seller> pagedList = null;

            List<Seller> list = null;

            string procName = "[dbo].[Products_Select_All_Products_BySellerId]";

            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@VenderId", sellerId);
                parameterCollection.AddWithValue("@PageIndex", pageIndex);
                parameterCollection.AddWithValue("@PageSize", pageSize);
            }, (reader, recordSetIndex) =>
            {
                Seller seller = MapSeller(reader);
                if (totalCount == 0)
                {                   
                    totalCount = reader.GetSafeInt32(28);
                }

                if (list == null)
                {
                    list = new List<Seller>();
                }

                list.Add(seller);
            });

            if (list != null)
            {
                pagedList = new Paged<Seller>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        private static Seller MapSeller(IDataReader reader)
        {
          
            Seller aSeller = new Seller();
            int startingIndex = 0;
            aSeller.ProductId = reader.GetSafeInt32(startingIndex++);
            aSeller.Manufacturer = reader.GetSafeString(startingIndex++);
            aSeller.Year = reader.GetSafeInt32(startingIndex++);
            aSeller.Name = reader.GetSafeString(startingIndex++);
            aSeller.SKU = reader.GetSafeString(startingIndex++);
            aSeller.Description = reader.GetSafeString(startingIndex++);
            aSeller.IsVisible = reader.GetSafeBool(startingIndex++);
            aSeller.IsActive = reader.GetSafeBool(startingIndex++);
            aSeller.PrimaryImage = reader.GetSafeString(startingIndex++);
            aSeller.DateCreated = reader.GetSafeUtcDateTime(startingIndex++);
            aSeller.DateModified = reader.GetSafeUtcDateTime(startingIndex++);
            aSeller.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aSeller.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            aSeller.Specifications = reader.GetSafeString(startingIndex++);
            aSeller.VendorId = reader.GetSafeInt32(startingIndex++);
            aSeller.VendorName = reader.GetSafeString(startingIndex++);
            aSeller.ProductTypeId = reader.GetSafeInt32(startingIndex++);
            aSeller.ProductTypeName = reader.GetSafeString(startingIndex++);
            aSeller.ProductConditionTypesId = reader.GetSafeInt32(startingIndex++);
            aSeller.ProductTypeCondition = reader.GetSafeString(startingIndex++);
            aSeller.UserProfilesId = reader.GetSafeInt32(startingIndex++);
            aSeller.UserId = reader.GetSafeInt32(startingIndex++);
            aSeller.FirstName = reader.GetSafeString(startingIndex++);
            aSeller.LastName = reader.GetSafeString(startingIndex++);
            aSeller.Mi = reader.GetSafeString(startingIndex++);

            aSeller.Inventory = new Inventory();
            aSeller.Inventory.Id = reader.GetSafeInt32(startingIndex++);
            aSeller.Inventory.Quantity = reader.GetSafeInt32(startingIndex++);
            aSeller.Inventory.BasePrice = reader.GetSafeDecimal(startingIndex++);

            return aSeller;
        }

        private static Product MapFilter(IDataReader reader)
        {
            Product aProduct = new Product();

            int startingIndex = 0;
          
            aProduct.ProductType = new ProductType();
            aProduct.Inventory = new Inventory();

            aProduct.Id = reader.GetSafeInt32(startingIndex++);
            aProduct.Manufacturer = reader.GetSafeString(startingIndex++);
            aProduct.Year = reader.GetSafeInt32(startingIndex++);
            aProduct.Name = reader.GetSafeString(startingIndex++);
            aProduct.SKU = reader.GetSafeString(startingIndex++);
            aProduct.Description = reader.GetSafeString(startingIndex++);
            aProduct.ProductTypeId = reader.GetSafeInt32(startingIndex++);
            aProduct.VendorId = reader.GetSafeInt32(startingIndex++);
            aProduct.ConditionTypeId = reader.GetSafeInt32(startingIndex++);
            aProduct.IsVisible = reader.GetSafeBool(startingIndex++);
            aProduct.IsActive = reader.GetSafeBool(startingIndex++);
            aProduct.PrimaryImage = reader.GetSafeString(startingIndex++);
            aProduct.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aProduct.DateModified = reader.GetSafeDateTime(startingIndex++);
            aProduct.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aProduct.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            aProduct.Specifications = reader.GetSafeString(startingIndex++);

            aProduct.ProductType.Id = reader.GetSafeInt32(startingIndex++);
            aProduct.ProductType.Name = reader.GetSafeString(startingIndex++);
            aProduct.ProductType.Description = reader.GetSafeString(startingIndex++);

            aProduct.Inventory.Id = reader.GetSafeInt32(startingIndex++);
            aProduct.Inventory.BasePrice = reader.GetSafeDecimal(startingIndex++);
            aProduct.Inventory.Quantity = reader.GetSafeInt32(startingIndex++);
            aProduct.Inventory.ProductId = reader.GetSafeInt32(startingIndex++);

            return aProduct;
        }

        private static Product MapProduct(IDataReader reader)
        {
            Product aProduct = new Product();

            int startingIndex = 0;

            aProduct.Id = reader.GetSafeInt32(startingIndex++);

            aProduct.Inventory = new Inventory();
            aProduct.Inventory.Id = reader.GetSafeInt32(startingIndex++);
            aProduct.Inventory.Quantity = reader.GetSafeInt32(startingIndex++);
            aProduct.Inventory.BasePrice = reader.GetSafeDecimal(startingIndex++);

            aProduct.Manufacturer = reader.GetSafeString(startingIndex++);
            aProduct.Year = reader.GetSafeInt32(startingIndex++);
            aProduct.Name = reader.GetSafeString(startingIndex++);
            aProduct.SKU = reader.GetSafeString(startingIndex++);
            aProduct.Description = reader.GetSafeString(startingIndex++);
            aProduct.ProductTypeId = reader.GetSafeInt32(startingIndex++);
            aProduct.VendorId = reader.GetSafeInt32(startingIndex++);
            aProduct.ConditionTypeId = reader.GetSafeInt32(startingIndex++);
            aProduct.IsVisible = reader.GetSafeBool(startingIndex++);
            aProduct.IsActive = reader.GetSafeBool(startingIndex++);
            aProduct.PrimaryImage = reader.GetSafeString(startingIndex++);
            aProduct.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aProduct.DateModified = reader.GetSafeDateTime(startingIndex++);
            aProduct.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aProduct.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            aProduct.Specifications = reader.GetSafeString(startingIndex++);

            return aProduct;
        }

        private static void AddCommonParams(ProductAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Manufacturer", model.Manufacturer);
            col.AddWithValue("@Year", model.Year);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@ProductTypeId", model.ProductTypeId);
            col.AddWithValue("@VendorId", model.VendorId);
            col.AddWithValue("@ConditionTypeId", model.ConditionTypeId);
            col.AddWithValue("@IsVisible", model.IsVisible);
            col.AddWithValue("@IsActive", model.IsActive);
            col.AddWithValue("@PrimaryImage", model.PrimaryImage);
            col.AddWithValue("@Specifications", model.Specifications);
        }


    }
}
