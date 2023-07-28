using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Credit_Application_Status
	{
		[Key] public int CreditApplicationStatusID { get; set; }
		[Required][MaxLength(30)] public string Description { get; set; } = string.Empty;
	}
}
