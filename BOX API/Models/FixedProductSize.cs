using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class FixedProductSize
	{
		[ForeignKey("Size")]
		public int SizeID { get; set; }
		public virtual Size Size { get; set; }

		[ForeignKey("Fixed_Product")]
		public int FixedProductID { get; set; }
		public virtual Fixed_Product Fixed_Product { get; set; }
	}
}
