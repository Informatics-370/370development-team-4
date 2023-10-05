namespace BOX.ViewModel
{
    public class DeliveryScheduleReportViewModel
    {
        public int OrderID { get; set; }
        public string CustomerID {  get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string Code { get; set; }
        public string QRCodeB64 {  get; set; }
    }
}
