using Microsoft.VisualBasic;

namespace BOX.ViewModel
{
	public class CustomerOrderViewModel
	{
		public int CustomerOrderID { get; set; }
		public int CustomerStatusID { get; set; }
		public int CustomerID { get; set;}
		public int? OrderDeliveryScheduleID { get; set; }
		public string Date { get; set; }
		public string DeliveryPhoto { get; set; }
		public string CustomerFullName { get; set; }
		public string OrderStatusDescription { get; set; }
		public List<CustomerOrderLineViewModel> CustomerOrders { get; set; }


	}
}
