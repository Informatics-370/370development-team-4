using BOX.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.ViewModel
{
    public class QuoteViewModel
    {
        public int QuoteRequestID { get; set; }
        public int QuoteID { get; set; }
        public string CustomerId { get; set; }
        public string CustomerFullName { get; set; }
        public DateTime DateRequested { get; set; } //date the quote was requested
        public int RejectReasonID { get; set; }
        public string RejectReasonDescription { get; set; }
        public string PriceMatchFileB64 { get; set; }
        public DateTime DateGenerated { get; set; } //date the quote was generated
        public int QuoteStatusID { get; set; }
        public string QuoteStatusDescription { get; set; }
        public int QuoteDurationID { get; set; }
        public List<QuoteLineViewModel> Lines { get; set; }
    }
}
