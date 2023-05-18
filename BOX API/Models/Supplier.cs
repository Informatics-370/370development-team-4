using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
  public class Supplier
  {
    [Key] public int SupplierID { get; set; }
    [ForeignKey("Fixed_Product")]
    public int FixedProductID { get; set; }
    public virtual Fixed_Product Fixed_Product { get; set; }
    [Required][MaxLength(50)] public string Name { get; set; } = string.Empty;
    [Required][MaxLength(50)] public string Address { get; set; } = string.Empty;
    [Required][StringLength(10)] public string Contact_Number { get; set; } = string.Empty;
    [Required][MaxLength(75)] public string Email { get; set; } = string.Empty;


  }
}


