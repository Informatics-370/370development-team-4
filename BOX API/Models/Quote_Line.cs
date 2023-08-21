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
    }
}
