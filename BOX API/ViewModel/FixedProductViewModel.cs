﻿namespace BOX.ViewModel
{
    public class FixedProductViewModel
    {
        public int FixedProductID { get; set; }
        public int QRCodeID { get; set; }
        public int ItemID { get; set; }
        public int SizeID { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ProductPhotoB64 { get; set; }
        public byte[] QRCodeBytes { get; set; }
    }
}
