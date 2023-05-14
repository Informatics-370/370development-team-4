using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace BOX.Models
{
	public class Estimate_Duration
	{
		[Key] public int EstimateDurationID { get; set; }
		[Required] public DateFormat Duration { get; set; }
	}
}
