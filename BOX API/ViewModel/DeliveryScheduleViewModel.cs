using Microsoft.VisualBasic;

namespace BOX.ViewModel
{
	public class DeliveryScheduleViewModel
	{
		public int OrderDeliveryScheduleID { get; set; }
		public string DriverId { get; set; } //ID of driver assigned this schedule
		public string DriverFullName { get; set; }
		public string Date { get; set; }
		List<CustomerOrderViewModel> Orders { get; set; }
	}
}
