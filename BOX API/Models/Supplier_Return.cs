using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Supplier_Return
	{
		[Key] public int SupplierReturnID { get; set; }
		[Required] public DateFormat Date { get; set; }

	}
}
