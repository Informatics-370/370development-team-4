using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BOX.Models
{
    public class Reject_Reason
    {
        [Key] public int RejectReasonID { get; set; }

        [ForeignKey("Price_Match_File")]
        public int? PriceMatchFileID { get; set; }
        public virtual Price_Match_File Price_Match_File { get; set; }
        [Required] public string Description { get; set; } = string.Empty;
    }
}
