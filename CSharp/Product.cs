using System;
using System.Collections.Generic;
using System.Text;
using ReCycle.Models;

namespace ReCycle.Models.Domain
{
    public class Product
    {
        public int Id { get; set; }

        public string Manufacturer { get; set; }

        public int Year { get; set; }

        public string Name { get; set; }

        public string SKU { get; set; }

        public string Description { get; set; }

        public int ProductTypeId { get; set; }

        public int VendorId { get; set; }

        public int ConditionTypeId { get; set; }

        public bool IsVisible { get; set; }

        public bool IsActive { get; set; }

        public string PrimaryImage { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public int CreatedBy { get; set; }

        public int ModifiedBy { get; set; }

        public string Specifications { get; set; }

        public ProductType ProductType { get; set; }

        public Inventory Inventory { get; set; }

    }


    public class Seller
    {
        public int ProductId { get; set; }
        public string Manufacturer { get; set; }
        public int Year { get; set; }
        public string Name { get; set; }
        public string SKU { get; set; }
        public string Description { get; set; }
        public bool IsVisible { get; set; }
        public bool IsActive { get; set; }
        public string PrimaryImage { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public string Specifications { get; set; }
        public int VendorId { get; set; }
        public string VendorName { get; set; }
        public int ProductTypeId { get; set; }
        public string ProductTypeName { get; set; }
        public int ProductConditionTypesId { get; set; }
        public string ProductTypeCondition { get; set; }
        public int UserProfilesId { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Mi { get; set; }
        public Inventory Inventory { get; set; }

    }

    public class Top3Item
    {
        public int InventoryId { get; set; }
        public decimal BasePrice { get; set; }
        public int ProductId { get; set; }
        public string Manufacturer { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string PrimaryImage { get; set; }
    }



}
