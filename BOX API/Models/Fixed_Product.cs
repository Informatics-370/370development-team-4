using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BOX.Models
{
	public class Fixed_Product
	{
        [Key]
        public int? FixedProductID { get; set; }

        [ForeignKey("QR_Code")]
        public int QRCodeID { get; set; }
        public virtual QR_Code QR_Code { get; set; }

        [ForeignKey("Product_Item")]
        public int ItemID { get; set; }
        public virtual Product_Item Product_Item { get; set; }

        [ForeignKey("Size_Units")]
        public int SizeID { get; set; }
        public virtual Size_Units Size_Units { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public byte[] Product_Photo { get; set; }

        [Required]
        public int Quantity_On_Hand { get; set; }
    }
}
