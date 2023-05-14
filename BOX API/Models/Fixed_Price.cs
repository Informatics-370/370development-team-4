using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Fixed_Price
	{
		[Key] public int PriceID { get; set; }
		[Required] public DateFormat Date { get; set; }
		[Required] public Decimal Amount { get; set; }


	}
}
