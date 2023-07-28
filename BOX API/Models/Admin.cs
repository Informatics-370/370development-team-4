using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Admin
	{
		[Key] public int AdminID { get; set; }
		[ForeignKey("Username")]
		public int UserId { get; set; }
		public virtual User User { get; set; }
	}
}
