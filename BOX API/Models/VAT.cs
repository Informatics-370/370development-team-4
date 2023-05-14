using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace BOX.Models
{
	public class VAT
	{
		[Key] public int VatID { get; set; }
		[Required] public DateFormat Date { get; set; }
		[Required] public int Percentage { get; set; }
	}
}
