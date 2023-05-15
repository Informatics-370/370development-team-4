using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BOX.Models
{
	public class Fixed_Product
	{
		[Key] public int FixedProductID { get; set; }
		
		[ForeignKey("QR_Code")]
		public int QRCodeID { get; set; }

		public virtual QR_Code QR_Code { get; set; }
		[ForeignKey("Product_Item")]
		public int ItemID { get; set; }

		public virtual Product_Item Product_Item { get; set; }
		[Required][MaxLength(100)]public string Description { get; set; } = string.Empty;
		[Required] public decimal Price { get; set; }
	}
}
