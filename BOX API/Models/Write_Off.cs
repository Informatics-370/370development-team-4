using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Write_Off
	{
		[Key] public int WriteOffID { get; set; }
		
		[ForeignKey("Write_Off_Reason")]
		public int WriteOffReasonID { get; set; }
		public virtual Write_Off_Reason Write_Off_Reason { get; set; }

		[ForeignKey("Stock_Take")]
		public int StockTakeID { get; set; }
		public virtual Stock_Take Stock_Take { get; set; }

        [ForeignKey("RawMaterial")]
        public int? RawMaterialId { get; set; }
        public virtual Raw_Material RawMaterial { get; set; }

        [ForeignKey("FixedProduct")]
        public int? FixedProductId { get; set; }
        public virtual Fixed_Product FixedProduct { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
