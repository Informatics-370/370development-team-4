using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Audit_Trail
	{
		[Key] public int AuditTrailID { get; set; }
		[Required] public string User_FullName { get; set; } = string.Empty;
		[Required] public string Transaction_Type { get; set; } = string.Empty;
        [Required] public DateTime DateTime { get; set; }
        //holds any critical amounts associated with this trancsaction e.g. for a place order it will be the order total; for a stock take, it's the total quantity written off
        [Required] public string Critical_Data { get; set; } = string.Empty;
        //holds a description of the critical data e.g. tells you that the R15000 stored in critical data is order total or the 56 is total stock quantity written off
        [Required] public string Critical_Data_Description { get; set; } = string.Empty;
	}
}
