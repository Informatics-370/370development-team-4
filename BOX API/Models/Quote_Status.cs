using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Quote_Status
	{
		[Key] public int QuoteStatusID { get; set; }
		[Required][MaxLength(30)] public string Description { get; set; } = string.Empty;
	}
}
