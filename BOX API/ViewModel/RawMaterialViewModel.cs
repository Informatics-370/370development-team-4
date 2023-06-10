using System.ComponentModel.DataAnnotations;

namespace BOX.ViewModel
{
	public class RawMaterialViewModel
	{
		public int RawMaterialID { get; set; }
		public string Description { get; set; }
		public int QRCodeID { get; set; }

		public byte[] QRCodeBytes { get; set; } //string that holds the QR code photo as text; already includes 'data:image/png;base64'
	}
}
