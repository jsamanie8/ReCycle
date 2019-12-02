using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ReCycle.Models.Requests.Products
{
    public class ProductUpdateRequest : ProductAddRequest, IModelIdentifier
    {
        public int Id { get; set; }

    }
}
