using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.Models
{
	public class Customer_Review
	{
		[Key] public int CustomerReviewID { get; set; }

		[Required] 
		public int Product_Rating { get; set; }
		
		[Required]
		[MaxLength(256)] 
		public string Comments { get; set; } = string.Empty;
		
		[Required]
		[MaxLength(256)] 
		public bool Recommendation { get; set; }
	}
}
