using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.Models
{
	public class User
	{
		[Key] public int UserID { get; set; }
		// Foreign key   

		[ForeignKey("Role")]
		public int RoleID { get; set; }
		public virtual Role Role { get; set; }
		[Required][MaxLength(50)] public string user_FirstName { get; set; } = string.Empty;
		[Required][MaxLength(50)] public string user_LastName { get; set; } = string.Empty;
		[Required][MaxLength(75)] public string user_Email { get; set; } = string.Empty;
		[Required][MaxLength(16)] public string user_Password { get; set; } = string.Empty;
		[Required][StringLength(10)] public string user_Cellnum { get; set; } = string.Empty;
		[Required][MaxLength(100)] public string user_Address { get; set; } = string.Empty;
		[Required][MaxLength(4)] public string title { get; set; } = string.Empty;

	}
}
