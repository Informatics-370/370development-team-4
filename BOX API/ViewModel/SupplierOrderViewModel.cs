namespace BOX.ViewModel
{
	public class SupplierOrderViewModel
	{
		public int SupplierOrderID { get; set; }
		public int SupplierID { get; set; }
		public string Date { get; set; }
		public List<SupplierOrderLineViewModel> SupplierOrders { get; set; }


	}
}
