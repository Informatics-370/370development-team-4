using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace BOX.Models
{
	public class Supplier_Order
	{
		[Key]
		public int SupplierOrderID { get; set; }
		[Required] public string Date { get; set; }
	}
}
