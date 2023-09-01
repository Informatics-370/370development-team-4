using Microsoft.VisualBasic;

namespace BOX.ViewModel
{
	public class CustomerOrderViewModel
	{
		public int CustomerOrderID { get; set; }
		public int QuoteID { get; set; }
		public int OrderStatusID { get; set; }
        public string OrderStatusDescription { get; set; }
        public string CustomerId { get; set; }
        public string CustomerFullName { get; set; }
        public int DeliveryScheduleID { get; set; }
		public DateTime DeliveryDate { get; set; }
		public DateTime Date { get; set; } //date ordered
		public string DeliveryType { get; set; } //delivery or pick up
		public string DeliveryPhoto { get; set; }
        public List<CustomerOrderLineViewModel> OrderLines { get; set; }
	}
}
