using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Customer_Return
	{
		[Key] public int? CustomerReturnID { get; set; }
		[ForeignKey("Customer_Return_Reason")]
		public int CustomerReturnReasonID { get; set; }
		public virtual Customer_Return_Reason Customer_Return_Reason { get; set; }
		[Required] public decimal Amount { get; set; }

	}
}
