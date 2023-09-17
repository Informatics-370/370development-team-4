using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BOX.Models
{
    public class Reject_Reason
    {
        [Key] public int RejectReasonID { get; set; }
        [Required] public string Description { get; set; } = string.Empty;
    }
}
