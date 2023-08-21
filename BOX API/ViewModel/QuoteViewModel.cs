using BOX.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.ViewModel
{
    public class QuoteViewModel
    {
        //quote request-specific info
        public int QuoteRequestID { get; set; }
        public DateTime DateRequested { get; set; } //date the quote was requested

        //quote-specific info
        public int QuoteID { get; set; }
        public int QuoteStatusID { get; set; }
        public string QuoteStatusDescription { get; set; }
        public int RejectReasonID { get; set; }
        public string RejectReasonDescription { get; set; }
        public string PriceMatchFileB64 { get; set; }
        public DateTime DateGenerated { get; set; } //date the quote was generated
        public int QuoteDurationID { get; set; }
        public int QuoteDuration { get; set; }

        //generic info
        public string CustomerId { get; set; }
        public string CustomerFullName { get; set; }
        public List<QuoteLineViewModel> Lines { get; set; }
    }
}
