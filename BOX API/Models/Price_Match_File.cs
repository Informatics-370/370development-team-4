using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BOX.Models
{
    public class Price_Match_File
    {
        [Key] public int PriceMatchFileID { get; set; }

        [ForeignKey("Quote")]
        public int QuoteID { get; set; }
        public virtual Quote Quote { get; set; }

        [ForeignKey("Reject_Reason")]
        public int RejectReasonID { get; set; }
        public virtual Reject_Reason Reject_Reason { get; set; }
        [Required] public byte[] File { get; set; }
    }
}
