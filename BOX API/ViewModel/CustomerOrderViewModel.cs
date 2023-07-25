using Microsoft.VisualBasic;

namespace BOX.ViewModel
{
	public class CustomerOrderViewModel
	{
		public int CustomerOrderID { get; set; }
		public int CustomerStatusID { get; set; }
		public int CustomerID { get; set;}
		public int OrderDeliveryScheduleID { get; set; }
		public string Date { get; set; }
		public string DeliveryPhoto { get; set; }
	}
}
