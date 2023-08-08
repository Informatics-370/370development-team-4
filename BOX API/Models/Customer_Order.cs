using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;
using Microsoft.VisualBasic;
using BOX.ViewModel;

namespace BOX.Models
{
	public class Customer_Order
	{
		[Key]
		public int CustomerOrderID { get; set; }
		[ForeignKey("Customer_Order_Status")]
		public int CustomerOrderStatusID { get; set; }
		public virtual Customer_Order_Status Customer_Order_Status { get; set; }
		[ForeignKey("Order_Delivery_Schedule")]
		public int? OrderDeliveryScheduleID { get; set; }
		public virtual Order_Delivery_Schedule Order_Delivery_Schedule { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual User User { get; set; }

        [Required] public string Date { get; set; }
		[Required] public byte[] Delivery_Photo { get; set; }

	}
}
