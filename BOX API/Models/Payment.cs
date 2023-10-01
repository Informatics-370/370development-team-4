using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Payment
	{
		[Key] public int PaymentID { get; set; }
		[ForeignKey("Payment_Type")]
		public int PaymentTypeID { get; set; }
		public virtual Payment_Type Payment_Type { get; set; }
		[ForeignKey("Customer_Order")]
		public int? CustomerOrderID { get; set; }
		public virtual Customer_Order Customer_Order { get; set; }

		[Required] public DateTime Date_And_Time { get; set;}
		[Required] public decimal Amount { get; set; }
    }
}
