using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.Models
{
    public class Quote_Request_Line
    {
        [Key] public int QuoteRequestLineID { get; set; }

        [ForeignKey("Quote_Request")]
        public int QuoteRequestID { get; set; }
        public virtual Quote_Request Quote_Request { get; set; }

        [ForeignKey("Fixed_Product")]
        public int? FixedProductID { get; set; }
        public virtual Fixed_Product Fixed_Product { get; set; }

        [ForeignKey("Custom_Product")]
        public int? CustomProductID { get; set; }
        public virtual Custom_Product Custom_Product { get; set; }
        [Required] public int Quantity { get; set; }
    }
}
