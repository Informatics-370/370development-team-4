namespace BOX.ViewModel
{
	public class SupplierOrderLineViewModel
	{
		public int Supplier_OrderLineID { get; set; }
		public int Fixed_ProductID { get; set; }
		public int Raw_MaterialID { get; set; }
		public int Supplier_ReturnID { get; set; }
		public string FixedProductDescription { get; set; }	
		public string RawMaterialDescription { get; set; }
		public int Quantity { get; set; }

	}
}
