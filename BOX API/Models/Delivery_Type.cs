using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
    public class Delivery_Type
    {
        [Key] public int DeliveryTypeID { get; set; }
        [Required][MaxLength(30)] public string Description { get; set; } = string.Empty;
    }
}
