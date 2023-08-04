using BOX.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.ViewModel
{
    public class StockTakeViewModel
    {
        public int StockTakeID { get; set; }
        public string UserId { get; set; }
        public string Date { get; set; }
        public virtual List<WriteOffVM> WriteOffs { get; set; }
    }
}
