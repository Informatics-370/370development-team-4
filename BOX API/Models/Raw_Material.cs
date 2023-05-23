using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Raw_Material
	{
		[Key] public int RawMaterialID { get; set; }
		[Required][MaxLength(70)]public string Description { get; set; } = string.Empty;



	}
}
