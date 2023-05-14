using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Estimate_Line

	{
		

	
		[ForeignKey("Customer")]
		[Column(Order = 0)]
		public int CustomerID { get; set; }
		public virtual Customer Customer { get; set; }
		
		[ForeignKey("Estimate")]
		[Column(Order = 1)]
		public int EstimateID { get; set; }
		public virtual Estimate Estimate { get; set; }
		
		[ForeignKey("Admin")]
		[Column(Order = 2)]
		public int AdminID { get; set; }
		public virtual Admin Admin { get; set; }
		[Required] public decimal Confirmed_Unit_Price { get; set; }

	}
}
