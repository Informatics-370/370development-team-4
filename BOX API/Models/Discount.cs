using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Discount
	{
		[Key] public int DiscountID { get; set; }
		[Required] public int Percentage { get; set; }
		[Required] public int Quantity { get; set; }

	}
}
