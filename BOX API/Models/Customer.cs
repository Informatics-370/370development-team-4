using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Customer
	{
		//Setting a Primary Key
		[Key] public int customerID { get; set; }
		//Setting Foreign Keys
		[ForeignKey("Username")]
		public int UserId { get; set; }
		public virtual User User { get; set; }
		[ForeignKey("Employee")]
		public int EmployeeID { get; set; }
		public virtual Employee Employee { get; set; }
		[Required] public bool isBusiness { get; set; }
		[Required][MaxLength(10)] public string VAT_NO { get; set; } = string.Empty;

		[Required] public decimal Credit_Limit { get; set; }
		[Required] public decimal Credit_Balance { get; set; }
		[Required] public decimal Discount { get; set; }


	}
}
