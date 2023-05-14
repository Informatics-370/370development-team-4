using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace BOX.Models
{
	public class Order_Delivery_Schedule
	{
		[Key] public int OrderDeliveryScheduleID { get; set; }

		[ForeignKey("Employee")]
		public int EmployeeID { get; set; }
		public virtual Employee Employee { get; set; }
		[Required]
		public DateTime Date { get; set; }
	}
}
