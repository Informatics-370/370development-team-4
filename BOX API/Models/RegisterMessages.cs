using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
    public class RegisterMessages
    {
        [Key]
        public int messageId { get; set; }
        public string message { get; set; }

        public DateTime messageDate { get; set; }
    }
}
