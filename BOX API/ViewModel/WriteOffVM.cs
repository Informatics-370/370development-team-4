using BOX.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.ViewModel
{
    public class WriteOffVM
    {
        public int WriteOffID { get; set; }
        public int WriteOffReasonID { get; set; }
        public int StockTakeID { get; set; }
        public int RawMaterialId { get; set; }
        public int FixedProductId { get; set; }
        public string RawMaterialDescription { get; set; }
        public string FixedProductDescription { get; set; }
        public int Quantity { get; set; }
    }
}
