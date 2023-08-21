using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.Models
{
	public class Customer_Review
	{
		[Key] public int CustomerReviewID { get; set; }

        [ForeignKey("Customer_Order")]
        public int CustomerOrderID { get; set; }
        public virtual Customer_Order Customer_Order { get; set; }
        [Required] public int Product_Rating { get; set; }
		[Required][MaxLength(256)] public string Comments { get; set; } = string.Empty;
		[Required] public bool Recommendation { get; set; }
	}
}
