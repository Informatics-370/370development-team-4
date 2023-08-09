using BOX.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.ViewModel
{
    public class QuoteRequestViewModel
    {
        public int QuoteRequestID { get; set; }
        public string UserId { get; set; }
        public string UserFullName { get; set; }
        public DateTime Date { get; set; } //order quote requests from oldest to latest requests
        public List<QuoteRequestLineViewModel> RequestLines { get; set; }
    }
}
