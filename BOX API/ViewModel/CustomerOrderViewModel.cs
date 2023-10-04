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
        public int DeliveryTypeID { get; set; }
        public string DeliveryType { get; set; } //delivery or pick up
		public string DeliveryPhoto { get; set; }
        public int PaymentTypeID { get; set; }
        public string PaymentType { get; set; }
        public int PaymentID { get; set; } //ID of payment to attach order to
        public string Code { get; set; }
        public string QRCodeB64 { get; set; }
        public int ReviewID { get; set; }
        public List<CustomerOrderLineViewModel> OrderLines { get; set; }
	}
}
