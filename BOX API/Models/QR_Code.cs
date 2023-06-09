using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;


namespace BOX.Models
{
	public class QR_Code
	{
		[Key] public int QRCodeID { get; set; }
		[Required] public string QR_Code_Photo { get; set; }

	}
}
