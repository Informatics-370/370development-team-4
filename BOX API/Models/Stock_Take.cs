using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace BOX.Models
{
	public class Stock_Take
	{
		[Key] public int StockTakeID { get; set; }
		[ForeignKey("Employee")]
		public int EmployeeID { get; set; }
		public virtual Employee Employee { get; set; }
		[Required]
		public DateFormat Date { get; set; }
	}
}
