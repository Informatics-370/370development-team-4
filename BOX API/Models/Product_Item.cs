using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Product_Item
	{
		[Key] public int ItemID { get; set; }
		[ForeignKey("Product_Category")]
		public int CategoryID { get; set; }
		public virtual Product_Category Product_Category { get; set; }
		[Required][MaxLength(70)] public string Description { get; set; } = string.Empty;

	}
}
