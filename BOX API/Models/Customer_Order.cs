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

        [ForeignKey("Quote")]
        public int QuoteID { get; set; }
        public virtual Quote Quote { get; set; }

        [ForeignKey("Customer_Order_Status")]
		public int CustomerOrderStatusID { get; set; }
		public virtual Customer_Order_Status Customer_Order_Status { get; set; }
		
		[ForeignKey("Order_Delivery_Schedule")]
		public int? OrderDeliveryScheduleID { get; set; }
		public virtual Order_Delivery_Schedule Order_Delivery_Schedule { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual User User { get; set; }

        [Required] public DateTime Date { get; set; }
		[Required] public DateTime Delivery_Date { get; set; }
		[Required] public byte[] Delivery_Photo { get; set; }


        [ForeignKey("Delivery_Type")]
        public int DeliveryTypeID { get; set; }
        public virtual Delivery_Type Delivery_Type { get; set; }

        [ForeignKey("Payment_Type")]
        public int PaymentTypeID { get; set; }
        public virtual Payment_Type Payment_Type { get; set; }

        //QR code. Will link to QR code table later
        public string? Code { get; set; }
        public byte[] QR_Code_Photo { get; set; }
    }
}
