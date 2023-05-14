using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BOX.Models
{
	public class Fixed_Product
	{
		[Key] public int FixedProductID { get; set; }
		[ForeignKey("Size")]
		public int SizeID { get; set; }
		public virtual Size Size { get; set; }
		[ForeignKey("QR_Code")]
		public int QRCodeID { get; set; }

		public virtual QR_Code QR_Code { get; set; }
		[ForeignKey("Product_Item")]
		public int ItemID { get; set; }

		public virtual Product_Item Product_Item { get; set; }
		[Required][MaxLength(100)]public string Description { get; set; } = string.Empty;
	}
}
