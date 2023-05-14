using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Payment_Type
	{
		[Key] public int PaymentTypeID { get; set; }
		[Required][MaxLength(30)] public string Description { get; set; }=string.Empty;
	}
}
