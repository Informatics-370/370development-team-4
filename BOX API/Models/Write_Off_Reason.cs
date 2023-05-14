using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Write_Off_Reason
	{
		[Key]
		public int WriteOffReasonID { get; set; }
		[Required]
		public string Description { get; set; }
	}
}
