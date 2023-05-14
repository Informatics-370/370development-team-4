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
		[ForeignKey("Customer")]
		public int CustomerID { get; set; }
		public virtual Customer Customer { get; set; }
		[Required] public DateTime Date_And_Time { get; set;}
		[Required] public decimal Amount { get; set; }




	}
}
