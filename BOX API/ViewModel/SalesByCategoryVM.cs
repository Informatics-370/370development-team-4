namespace BOX.ViewModel
{
    public class SalesByCategoryVM
    {
        public int ItemID { get; set; }
        public string ItemDescription { get; set; }
        public int CategoryID { get; set; }
        public string CategoryDescription { get; set; }
        public decimal Sales { get; set; }
    }
}
