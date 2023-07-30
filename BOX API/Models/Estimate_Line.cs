using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Org.BouncyCastle.Bcpg.OpenPgp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace BOX.Models
{
	public class Estimate_Line

	{
		[Key] public int EstimateLineID { get; set; }

    [ForeignKey("User")]
    public string UserId { get; set; }
    public virtual User User { get; set; }

    [ForeignKey("Estimate")]
		[Column(Order = 1)]
		public int EstimateID { get; set; }
		public virtual Estimate Estimate { get; set; }


		[ForeignKey("Custom_Product")]
		public int? CustomProductID { get; set; }
		public virtual Custom_Product Custom_Product { get; set; }

		[ForeignKey("Fixed_Product")]
		[Column(Order = 2)]
		public int? FixedProductID { get; set; }
		public virtual Fixed_Product Fixed_Product { get; set; }

		public int Quantity { get; set; }

		//This is to ensure we retrieve the details in string and integer format when we view Estimate Line:

		//This stuff is input in the EstimateLineView Model, the IDs are all we input in the actual Class
		////Customer Name:
		//public string CustomerName { get; set; }
		////Fixed product Name:
		//public string FixedProductName { get; set; }
		////Admin Name:
		//public string AdminName { get; set; }
		////Custom Product Name:
		//public string CustomProductName { get; set; }
		////Estimate Details, Status and Duration:
		//public string EstimateStatusDescription { get; set; }
		//public int EstimateDurationNumber { get; set; }



	}
}
