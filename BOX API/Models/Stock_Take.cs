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
		public string Date { get; set; }

		//[ForeignKey("RawMaterials")]
		//public int RawMaterialsId { get; set; }
		//public virtual Raw_Material RawMaterials { get; set; }
	}
}
