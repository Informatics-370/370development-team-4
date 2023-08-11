using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.Models
{

    public class Quote
    {
        [Key] public int QuoteID { get; set; }

        [ForeignKey("Quote_Status")]
        public int QuoteStatusID { get; set; }
        public virtual Quote_Status Quote_Status { get; set; }

        [ForeignKey("Quote_Duration")]
        public int QuoteDurationID { get; set; }
        public virtual Quote_Duration Quote_Duration { get; set; }

        [ForeignKey("User")] //employee
        public string UserId { get; set; }
        public virtual User User { get; set; }

        [ForeignKey("Quote_Request")]
        public int QuoteRequestID { get; set; }
        public virtual Quote_Request Quote_Request { get; set; }

        [ForeignKey("Reject_Reason")]
        public int? RejectReasonID { get; set; }
        public virtual Reject_Reason Reject_Reason { get; set; }

        [Required] public DateTime Date_Generated { get; set; }

    }
}
