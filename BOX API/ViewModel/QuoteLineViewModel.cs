using BOX.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.ViewModel
{
    public class QuoteLineViewModel
    {
        public int QuoteLineID { get; set; }
        public int QuoteRequestLineID { get; set; }
        public int FixedProductID { get; set; }
        public string FixedProductDescription { get; set; }
        public int CustomProductID { get; set; }
        public string CustomProductDescription { get; set; }
        public decimal SuggestedUnitPrice { get; set; }
        public decimal ConfirmedUnitPrice { get; set; }
        public int Quantity { get; set; }        
    }
}
