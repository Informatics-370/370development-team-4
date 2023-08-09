using BOX.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.ViewModel
{
    public class QuoteRequestLineViewModel
    {
        public int QuoteRequestLineID { get; set; }
        public int FixedProductID { get; set; }
        public string FixedProductDescription { get; set; }
        public decimal FixedProductSuggestedPrice { get; set; }
        public int CustomProductID { get; set; }
        public string CustomProductDescription { get; set; }
        public decimal CustomProductSuggestedPrice { get; set; }
        public int Quantity { get; set; }
    }
}
