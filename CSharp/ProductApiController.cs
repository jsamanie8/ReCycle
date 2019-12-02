using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ReCycle.Models;
using ReCycle.Models.Domain;
using ReCycle.Models.Requests.Products;
using ReCycle.Services;
using ReCycle.Web.Controllers;
using ReCycle.Web.Models.Responses;

namespace ReCycle.Web.Api.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductApiController : BaseApiController
    {
        private IProductService _service = null;
        private IAuthenticationService<int> _authService = null;

        public ProductApiController(IProductService service
            , ILogger<ProductApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(ProductAddRequest model)
        {
            ObjectResult result = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse($"Generic Error: {ex.Message}");
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(ProductUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();

            try
            {
                _service.Update(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("{id:int}"), AllowAnonymous]
        public ActionResult<ItemResponse<Product>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Product product = _service.Get(id);

                if (product == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Product> { Item = product };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("paginated"), AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Product>>> Get(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Product> paged = _service.Get(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Product>> response = new ItemResponse<Paged<Product>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<Product>>> GetByCurrent(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int authUserId = _authService.GetCurrentUserId();
                Paged<Product> pagedProduct = _service.Get(pageIndex, pageSize, authUserId);

                if (pagedProduct == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Product not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Product>> { Item = pagedProduct };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        //[HttpGet("filter"), AllowAnonymous]
        //public ActionResult<ItemResponse<Paged<Product>>> Filter(int pageIndex, int pageSize, int productTypeId, decimal priceFrom, decimal priceTo, string manufacturer)
        //{
        //    ActionResult result = null;

        //    try
        //    {
        //        Paged<Product> paged = _service.Filter(pageIndex, pageSize, productTypeId, priceFrom, priceTo, manufacturer);
        //        if(paged == null)
        //        {
        //            result = NotFound404(new ErrorResponse("Records Not Found"));
        //        }
        //        else
        //        {
        //            ItemResponse<Paged<Product>> response = new ItemResponse<Paged<Product>>();
        //            response.Item = paged;
        //            result = Ok200(response);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Logger.LogError(ex.ToString());
        //        result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
        //    }
        //    return result;
        //}


        [HttpGet("filter"), AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Product>>> Filter(int pageIndex, int pageSize, int productTypeId, string material, string size, string color)
        {
            ActionResult result = null;

            try
            {
                Paged<Product> paged = _service.Filter(pageIndex, pageSize, productTypeId, material, size, color);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Product>> response = new ItemResponse<Paged<Product>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("combined/types"), AllowAnonymous]
        public ActionResult<ItemResponse<ProductCombinedTypes>> GetProductCombinedTypes()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<ConditionType> conditionsList = _service.GetConditionType();
                List<ProductType> productsList = _service.GetProductType();

                if (conditionsList == null || productsList == null)
                {
                    code = 404;
                    response = new ErrorResponse("List of types not found.");
                }
                else
                {
                    ProductCombinedTypes combinedTypes = new ProductCombinedTypes();
                    combinedTypes.ConditionTypes = conditionsList;
                    combinedTypes.ProductTypes = productsList;
                    response = new ItemResponse<ProductCombinedTypes> { Item = combinedTypes };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("types"), AllowAnonymous]
        public ActionResult<ItemsResponse<ProductType>> GetProductTypes()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<ProductType> productsList = _service.GetProductType();

                if (productsList == null)
                {
                    code = 404;
                    response = new ErrorResponse("List of types not found.");
                }
                else
                {
                    
                    response = new ItemsResponse<ProductType> { Items = productsList };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("top3"), AllowAnonymous]
        public ActionResult<ItemsResponse<Top3Item>> GetTop3Items()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Top3Item> top3ItemList = _service.GetTop3Item();

                if (top3ItemList == null)
                {
                    code = 404;
                    response = new ErrorResponse("List of top 3 sale items not found.");
                }
                else
                {

                    response = new ItemsResponse<Top3Item> { Items = top3ItemList };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}/{isActive:bool}")]
        public ActionResult<SuccessResponse> Deactivate(int id, bool isActive)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Deactivate(id, isActive);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        
        [HttpGet("seller")]
        public ActionResult<ItemResponse<Paged<Seller>>> GetBySellerId(int pageIndex, int pageSize, int sellerId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {

                Paged<Seller> pagedProductVendor = _service.GetBySellerId(pageIndex, pageSize, sellerId);

                if (pagedProductVendor == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Product not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Seller>> { Item = pagedProductVendor };
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }



    }
}
