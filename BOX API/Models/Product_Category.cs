using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Product_Category
	{
		[Key] public int CategoryID { get; set; }
		[Required][MaxLength(50)] public string Description { get; set; } = string.Empty;


	}
}
