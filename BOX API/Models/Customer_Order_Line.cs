using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Customer_Order_Line
	{
		[Key] public int CustomerOrderLineID { get; set; }

		[ForeignKey("Customer_Return")]
		public int? CustomerReturnID { get; set; }
		public virtual Customer_Return Customer_Return { get; set; }
		
		[ForeignKey("Customer_Order")]
		public int CustomerOrderID { get; set; }
		public virtual Customer_Order Customer_Order { get; set; }
		
		[ForeignKey("Fixed_Product")]
		public int? FixedProductID { get; set; }
		public virtual Fixed_Product Fixed_Product { get; set; }
		
		[ForeignKey("Custom_Product")]
		public int? CustomProductID { get; set; }
		public virtual Custom_Product Custom_Product { get; set; }
		
		[Required] public int Quantity { get; set; }
        [Required] public decimal Confirmed_Unit_Price { get; set; }

    }
}
