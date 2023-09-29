using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
    public class Order_Line_Status
    {
        [Key] public int OrderLineStatusID { get; set; }
        [Required][MaxLength(30)] public string Description { get; set; } = string.Empty;
    }
}
