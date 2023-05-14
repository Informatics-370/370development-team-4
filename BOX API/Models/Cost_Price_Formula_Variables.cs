using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Cost_Price_Formula_Variables
	{
		[Key] public int FormulaID { get; set; }
		[Required][MaxLength(100)] public string Description { get; set; } = string.Empty;
		[Required] public decimal Box_Factor { get; set; }
		[Required] public decimal Rate_Per_Ton { get; set; }
		[Required] public decimal Factory_Cost { get; set; }
		[Required] public decimal Mark_Up { get; set; }




	}
}
