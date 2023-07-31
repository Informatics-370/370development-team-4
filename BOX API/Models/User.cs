using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.Models
{
	public class User : IdentityUser
    {
		[Required][MaxLength(50)] public string user_FirstName { get; set; } = string.Empty;
		[Required][MaxLength(50)] public string user_LastName { get; set; } = string.Empty;
		[Required][MaxLength(100)] public string user_Address { get; set; } = string.Empty;
		[Required][MaxLength(4)] public string title { get; set; } = string.Empty;

	}
}
