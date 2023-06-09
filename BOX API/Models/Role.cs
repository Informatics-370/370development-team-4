using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
namespace BOX.Models
{
	public class Role : IdentityRole<Guid>
    {
		//[Key] public Guid RoleID { get; set; }
		[Required][MaxLength(50)]public string Description { get; set; } = string.Empty;
	}
}
