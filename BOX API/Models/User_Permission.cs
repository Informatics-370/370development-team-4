using System.ComponentModel.DataAnnotations;
namespace BOX.Models
{
	public class User_Permission
	{
		[Key] public int UserPermissionID { get; set; }
		[Required][MaxLength(100)] public string Description { get; set; } = string.Empty;
	}
}
