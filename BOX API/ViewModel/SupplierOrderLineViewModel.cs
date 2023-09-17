namespace BOX.ViewModel
{
	public class SupplierOrderLineViewModel
	{
		public int SupplierOrderLineID { get; set; }
		public int FixedProductID { get; set; }
		public int RawMaterialID { get; set; }
		public int SupplierReturnID { get; set; }
		public string FixedProductDescription { get; set; }	
		public string RawMaterialDescription { get; set; }
		public int Quantity { get; set; }

	}
}
