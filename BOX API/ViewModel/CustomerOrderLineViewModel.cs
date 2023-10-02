namespace BOX.ViewModel
{
	public class CustomerOrderLineViewModel
	{
		public int CustomerOrderLineID { get; set; }

		public int FixedProductID { get; set; }
		public string FixedProductDescription { get; set; } 

        public int CustomProductID { get; set; }
        public string CustomProductDescription { get; set; }
		public decimal ConfirmedUnitPrice { get; set; }
		public int Quantity { get; set; }
        public int CustomerReturnID { get; set; }
        public int OrderLineStatusID { get; set; }
        public string OrderLineStatusDescription { get; set; }
    }
}
