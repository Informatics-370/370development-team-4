namespace BOX.ViewModel
{
    public class EstimateLineViewModel
    {
        public int EstimateLineID { get; set; }
        public int EstimateID { get; set; }
        public int? FixedProductID { get; set; }
        public string FixedProductDescription { get; set; } //data that I need when I get a specific estimate
        public decimal FixedProductUnitPrice { get; set; } //data that I need when I get a specific estimate
        public int? CustomProductID { get; set; }
        public string CustomProductDescription { get; set; } //data that I need when I get a specific estimate
        public decimal CustomProductUnitPrice { get; set; } //data that I need when I get a specific estimate
        public int Quantity { get; set; }

    }
}
