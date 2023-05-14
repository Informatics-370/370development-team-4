using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Customer_Refund
	{
		[Key] public int CustomerRefundID { get; set; }
		[ForeignKey("Customer_Refund_Reason")]
		public int CustomerRefundReasonID { get; set; }
		public virtual Customer_Refund_Reason Customer_Refund_Reason { get; set; }
		[Required] public decimal Amount { get; set; }

	}
}
