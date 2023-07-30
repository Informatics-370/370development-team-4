using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Customer_Order_Line
	{
		[Key] public int Customer_Order_LineID { get; set; }
		[ForeignKey("Customer")]
		public int CustomerID { get; set; }
		public virtual Customer Customer { get; set; }
		[ForeignKey("Customer_Refund")]
		public int? CustomerRefundID { get; set; }
		public virtual Customer_Refund Customer_Refund { get; set; }
		[ForeignKey("Customer_Order")]
		public int CustomerOrderID { get; set; }
		public virtual Customer_Order Customer_Order { get; set; }
		[ForeignKey("Fixed_Product")]
		public int? FixedProductID { get; set; }
		public virtual Fixed_Product Fixed_Product { get; set; }
		[ForeignKey("Custom_Product")]
		public int? CustomProductID { get; set; }// might need to set to nullable same as customer refund.
		public virtual Custom_Product Custom_Product { get; set; }
		[Required] public int Quantity { get; set; }

	}
}
