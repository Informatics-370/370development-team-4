using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Audit_Trail
	{
		[Key] public int AuditTrailID { get; set; }
		[Required] public string Name { get; set; } = string.Empty;
		[Required] public string Role { get; set; } = string.Empty;
		[Required] public bool Action { get; set; }
		[Required] public string Item_Type { get; set; } = string.Empty;
		[Required] public string Item_Name { get; set; } = string.Empty;
		[Required] public string Description { get; set; } = string.Empty;
		[Required] public DateFormat Date { get; set; }
	}
}
