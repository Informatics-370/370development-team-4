using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Customer_Refund_Reason
	{
		[Key] public int CustomerRefundReasonID { get; set; }
		[Required][MaxLength(30)] public string Description { get; set; }=string.Empty;


	}
}
