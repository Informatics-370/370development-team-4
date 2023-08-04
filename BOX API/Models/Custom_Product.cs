using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;

namespace BOX.Models
{
	public class Custom_Product
	{
		[Key]
    public int CustomProductID { get; set; }
		[ForeignKey("Product_Item")]
		public int ItemID { get; set; }
		public virtual Product_Item Product_Item { get; set; }
		[ForeignKey("Cost_Price_Formula_Variables")]
		public int FormulaID { get; set; }
		public virtual Cost_Price_Formula_Variables Cost_Price_Formula_Variables { get; set; }
		[Required] public decimal Width { get; set; }
		[Required] public decimal Height { get; set; }
		[Required] public decimal Length { get; set; }
		[Required] public byte[] Logo { get; set; }
		[Required] public byte[] Label { get; set; }



	}
}
