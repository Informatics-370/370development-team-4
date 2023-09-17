using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Supplier_Return
	{
		[Key] public int? SupplierReturnID { get; set; }
		[Required] public DateTime Date { get; set; }
		[Required] public int Quantity { get; set; }


	}
}
