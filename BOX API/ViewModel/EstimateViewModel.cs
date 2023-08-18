namespace BOX.ViewModel
{
    public class EstimateViewModel
    {
        public int EstimateID { get; set; }
        public int EstimateStatusID { get; set; }
        public string EstimateStatusDescription { get; set; }
        public int EstimateDurationID { get; set; }
        public decimal ConfirmedTotal { get; set; }
        public string UserId { get; set; }
        public string CustomerFullName { get; set; }
        public List<EstimateLineViewModel> Estimate_Lines { get; set; }

    }
}
