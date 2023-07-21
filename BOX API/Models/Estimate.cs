using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{


	public class Estimate
	{
		[Key] public int EstimateID { get; set; }
		[ForeignKey("Estimate_Status")]
		public int EstimateStatusID { get; set; }
		public virtual Estimate_Status Estimate_Status { get; set; }
		[ForeignKey("Estimate_Duration")]
		public int EstimateDurationID { get; set; }
		public virtual Estimate_Duration Estimate_Duration { get; set; }
		public decimal Confirmed_Total_Price { get; set; }

	}
}

