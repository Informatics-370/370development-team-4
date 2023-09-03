using System.ComponentModel.DataAnnotations;
namespace BOX.Models
{
	public class User_Permission
	{
        [Key] public int UserPermissionID { get; set; }
        [Required][MaxLength(100)] public string Description { get; set; } = string.Empty;
        public virtual ICollection<User_Role_Permission> RolePermissions { get; set; } = new List<User_Role_Permission>();
    }
}
