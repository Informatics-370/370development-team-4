using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Customer_Return_Reason
	{
		[Key] public int CustomerReturnReasonID { get; set; }
		[Required][MaxLength(30)] public string Description { get; set; }=string.Empty;


	}
}
