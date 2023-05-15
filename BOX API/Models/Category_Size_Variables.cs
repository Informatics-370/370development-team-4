using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.Models
{
	public class Category_Size_Variables
	{
		[ForeignKey("Size_Variables")]
		[Column(Order = 0)]
		public int SizeVariablesID { get; set; }
		public virtual Size_Variables Size_Variables { get; set; }

		[ForeignKey("Product_Category")]
		[Column(Order = 1)]
		public int CategoryID { get; set; }
		public virtual Product_Category Product_Category { get; set; }


	}
}
