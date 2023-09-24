using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Quote_Status
	{
		[Key] public int QuoteStatusID { get; set; }
		[Required][MaxLength(50)] public string Description { get; set; } = string.Empty;
	}
}
