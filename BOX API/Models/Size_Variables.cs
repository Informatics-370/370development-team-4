using System.ComponentModel.DataAnnotations;
namespace BOX.Models
{
	public class Size_Variables
	{
		[Key] public int SizeVariablesID { get; set; }
		[Required] public bool Width { get; set; }
		[Required] public bool Height { get; set; }
		[Required] public bool Length { get; set; }
		[Required] public bool Weight { get; set; }
		[Required] public bool Volume { get; set; }

	}
}
