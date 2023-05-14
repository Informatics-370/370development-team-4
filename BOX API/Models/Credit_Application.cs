using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Credit_Application
	{
		[Key] public int creditApplicationID { get; set; }
		[ForeignKey("Credit_Application_Status")]
		public int CreditApplicationStatusID { get; set; }
		public virtual Credit_Application_Status Credit_Application_Status { get; set; }
		[ForeignKey("Customer")]
		public int CustomerID { get; set; }
		public virtual Customer Customer { get; set; }
		[ForeignKey("Admin")]
		public int AdminID { get; set; }
		public virtual Admin Admin { get; set; }
		public byte[] Application_Pdf { get; set; }

	}
}
