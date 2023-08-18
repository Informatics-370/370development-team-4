using System.ComponentModel.DataAnnotations;

namespace BOX.ViewModel
{
	public class RawMaterialViewModel
	{
		public int? RawMaterialID { get; set; }
		public string Description { get; set; }
		public int QRCodeID { get; set; }

		public string QRCodeBytesB64 { get; set; } //string that holds the QR code photo as base64 text
        public int QuantityOnHand { get; set; }
    }
}
