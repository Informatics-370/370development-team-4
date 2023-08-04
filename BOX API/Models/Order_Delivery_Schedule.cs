using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace BOX.Models
{
	public class Order_Delivery_Schedule
	{
		[Key] public int OrderDeliveryScheduleID { get; set; }
    [ForeignKey("User")]
    public string UserId { get; set; }
    public virtual User User { get; set; }
    [Required]
		public string Date { get; set; }
	}
}
