using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.VisualBasic;

namespace BOX.Models
{
	public class Stock_Take
	{
		[Key]
		public int StockTakeID { get; set; }
		
		[ForeignKey("User")]
		public string UserId { get; set; }
		public virtual User User { get; set; }
		
		[Required]
		public DateTime Date { get; set; }
    }
}
