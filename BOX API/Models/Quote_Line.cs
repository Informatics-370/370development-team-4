using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.Models
{
    public class Quote_Line

    {
        [Key] public int QuoteLineID { get; set; }

        [ForeignKey("Quote")]
        [Column(Order = 1)]
        public int QuoteID { get; set; }
        public virtual Quote Quote { get; set; }


        [ForeignKey("Custom_Product")]
        public int? CustomProductID { get; set; }
        public virtual Custom_Product Custom_Product { get; set; }

        [ForeignKey("Fixed_Product")]
        [Column(Order = 2)]
        public int? FixedProductID { get; set; }
        public virtual Fixed_Product Fixed_Product { get; set; }

        [Required] public int Quantity { get; set; }
        [Required] public decimal Confirmed_Unit_Price { get; set; }

        //This is to ensure we retrieve the details in string and integer format when we view Quote Line:

        //This stuff is input in the QuoteLineView Model, the IDs are all we input in the actual Class
        ////Customer Name:
        //public string CustomerName { get; set; }
        ////Fixed product Name:
        //public string FixedProductName { get; set; }
        ////Admin Name:
        //public string AdminName { get; set; }
        ////Custom Product Name:
        //public string CustomProductName { get; set; }
        ////Quote Details, Status and Duration:
        //public string QuoteStatusDescription { get; set; }
        //public int QuoteDurationNumber { get; set; }



    }
}
