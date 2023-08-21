using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace BOX.Models
{
	public class Quote_Duration
	{
		[Key] public int QuoteDurationID { get; set; }
		[Required] public int Duration { get; set; }
	}
}
