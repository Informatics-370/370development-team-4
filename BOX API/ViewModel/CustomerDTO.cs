namespace BOX.ViewModel
{
    public class CustomerDTO
    {
        public string CustomerId { get; set; }
        public string UserId { get; set; }
        public string EmployeeId { get; set; }
        public bool IsBusiness { get; set; }
        public string VatNo { get; set; }
        public decimal? CreditLimit { get; set; }
        public decimal? CreditBalance { get; set; }
        public decimal? Discount { get; set; }
    }
}
