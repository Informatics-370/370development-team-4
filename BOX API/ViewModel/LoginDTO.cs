using System.ComponentModel.DataAnnotations;

namespace BOX.ViewModel
{
    public class LoginDTO
    {
        [Required]
        [StringLength(100)]
        public string emailaddress { get; set; }

        [Required]
        [StringLength(16)]
        public string password { get; set; }
    }
}
