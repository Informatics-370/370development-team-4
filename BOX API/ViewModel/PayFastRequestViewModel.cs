namespace BOX.ViewModel
{
    public class PayFastRequestViewModel
    {
        public int merchant_id { get; set; }
        public string merchant_key { get; set; }
        public string return_url { get; set; }
        public string cancel_url { get; set; }
        public string notify_url { get; set; }
        public string signature { get; set; }
        public string email_address { get; set; }
        public string cell_number { get; set; }
        public decimal amount { get; set; }
        public string item_name { get; set; }
    }
}
