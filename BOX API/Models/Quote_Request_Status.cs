using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
    public class Quote_Request_Status
    {
        [Key] public int QuoteRequestStatusID { get; set; }
        [Required][MaxLength(30)] public string Description { get; set; } = string.Empty;
    }
}
