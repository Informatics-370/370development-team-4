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
		[ForeignKey("User")]
		public string UserId { get; set; }
		public virtual User User { get; set; }
		public byte[] Application_Pdf { get; set; }

	}
}
