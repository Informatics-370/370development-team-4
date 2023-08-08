using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace BOX.Models
{
	public class Supplier_Order
	{
		[Key]
		public int SupplierOrderID { get; set; }

        [ForeignKey("Supplier")]
        public int SupplierID { get; set; }
        public virtual Supplier Supplier { get; set; }
        [Required] public string Date { get; set; }
	}
}
