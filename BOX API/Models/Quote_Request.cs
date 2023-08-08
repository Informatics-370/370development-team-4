using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOX.Models
{
    public class Quote_Request
    {
        [Key] public int QuoteRequestID { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual User User { get; set; }
        [Required] public DateTime Date { get; set; }
    }
}
