using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BOX.Models
{
    public class Price
    {
        [Key] public int PriceID { get; set; }

        [ForeignKey("Fixed_Product")]
        public int FixedProductID { get; set; }
        public virtual Fixed_Product Fixed_Product { get; set; }
        [Required] public DateOnly Date { get; set; }
    }
}
