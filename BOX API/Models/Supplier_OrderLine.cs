using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace BOX.Models
{
	public class Supplier_OrderLine
	{
		[Key]
		public int Supplier_Order_LineID { get; set; }

		[ForeignKey("Supplier_Return")]
		public int SupplierReturnID { get; set; }
		public virtual Supplier_Return Supplier_Return { get; set; }

		[ForeignKey("Supplier_Order")]
		public int SupplierOrderID { get; set; }
		public virtual Supplier_Order Supplier_Order { get; set; }


		[ForeignKey("Fixed_Product")]
		public int? FixedProductID { get; set; }
		public virtual Fixed_Product Fixed_Product { get; set; }


		[ForeignKey("Raw_Material")]
		public int? RawMaterialID { get; set; }
		public virtual Raw_Material Raw_Material { get; set; }


		[Required] public int Quantity { get; set; }

	}
}
