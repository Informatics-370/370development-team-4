using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Size
	{
		[Key] public int SizeID { get; set; }
		[Required] public decimal Width { get; set; }
		[Required] public decimal Height { get; set; }
		[Required] public decimal Length { get; set; }
		[Required] public decimal Weight { get; set; }
		[Required] public decimal Volume { get; set; }

	}
}
