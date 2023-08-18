namespace BOX.ViewModel
{
	public class SupplierOrderLineViewModel
	{
		public int Supplier_OrderLineID { get; set; }
		public int Supplier_OrderID { get; set; }
		public int? Fixed_ProductID { get; set; }
		public int? Raw_MaterialID { get; set; }
		public int Supplier_ReturnID { get; set; }
		public string FixedProduct_Description { get; set; }	
		public string Raw_Material_Description { get; set; }
		public int Quantity { get; set; }

	}
}
