using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Estimate_Status
	{
		[Key] public int EstimateStatusID { get; set; }
		[Required][MaxLength(30)] public string Description { get; set; } = string.Empty;
	}
}
