using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace BOX.Models
{
	public class VAT
	{
		[Key] public int VatID { get; set; }
		[Required] public int Percentage { get; set; }
        [Required] public DateTime Date { get; set; }
    }
}
