using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class User_Role_Permission
	{
		

		//Setting them as foreign Keys
		[ForeignKey("Role")]
		public virtual int RoleId { get; set; }
		public virtual Role Role { get; set; }

		[ForeignKey("User_Permission")]
		public virtual int UserPermissionID { get; set; }
		public virtual User_Permission UserPermission { get; set; }



	}
}
