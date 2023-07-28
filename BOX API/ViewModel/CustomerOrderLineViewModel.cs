namespace BOX.ViewModel
{
	public class CustomerOrderLineViewModel
	{
		public int CustomerOrderLineID { get; set; }

		public int CustomerOrderID { get; set; }

		public int FixedProductID { get; set; }

		public int CustomProductID { get; set; }

		public int? CustomerRefundID { get; set; }

		public string FixedProductDescription { get; set; } //data that I need when I get a specific estimate
		public decimal FixedProductUnitPrice { get; set; } //data that I need when I get a specific estimate
		public string CustomProductDescription { get; set; } //data that I need when I get a specific estimate
		public decimal CustomProductUnitPrice { get; set; } //data that I need when I get a specific estimate
		public string CustomerRefundDescription { get; set; } //data that I need when I get a specific estimate
		public int Quantity { get; set; }

	}
}
