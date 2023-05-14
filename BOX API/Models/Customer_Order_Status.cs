using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
    public class Customer_Order_Status
    {
        [Key] public int CustomerOrderStatusID { get; set; }
        [Required][MaxLength(30)] public string Description { get; set; } = string.Empty;
    }
}
