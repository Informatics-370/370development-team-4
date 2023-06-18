using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
	public class Raw_Material
	{
		[Key] public int RawMaterialID { get; set; }
		[Required][MaxLength(70)]public string Description { get; set; } = string.Empty;

        [ForeignKey("QR_Code")]
        public int QRCodeID { get; set; }

        public virtual QR_Code QR_Code { get; set; }

        [Required]
        public int Quantity_On_Hand { get; set; }


    }
}
