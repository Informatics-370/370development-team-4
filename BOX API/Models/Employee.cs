using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Employee
	{
		[Key] public int EmployeeID { get; set; }
		[ForeignKey("Username")]
		public int UserID { get; set; }
		public virtual User User { get; set; }
	}
}
