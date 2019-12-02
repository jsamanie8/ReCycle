using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ReCycle.Models.Requests.Products
{
    public class ProductAddRequest
    {
        [Required]
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Manufacturer must be between 2 and 100 characters.")]
        public string Manufacturer { get; set; }

        [Required]
        [Range(1, Int32.MaxValue, ErrorMessage = "Year must have be in this format: YYYY.")]
        public int Year { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 255 characters.")]
        public string Name { get; set; }

        [Required]
        [StringLength(4000, MinimumLength = 2, ErrorMessage = "Description must be between 2 and 4000 characters.")]
        public string Description { get; set; }

        [Required]
        [Range(1, Int32.MaxValue, ErrorMessage = "ProductTypeId must have a minimum value of 1.")]
        public int ProductTypeId { get; set; }

        [Required]
        [Range(1, Int32.MaxValue, ErrorMessage = "VendorId must have a minimum value of 1.")]
        public int VendorId { get; set; }

        [Required]
        [Range(1, Int32.MaxValue, ErrorMessage = "ConditionTypeId must have a minimum value of 1.")]
        public int ConditionTypeId { get; set; }

        [Required]
        public bool IsVisible { get; set; }

        [Required]
        public bool IsActive { get; set; }

        [Required]
        [StringLength(250, MinimumLength = 2, ErrorMessage = "PrimaryImage must be between 2 and 250 characters.")]
        public string PrimaryImage { get; set; }

        public string Specifications { get; set; }
    }
}
