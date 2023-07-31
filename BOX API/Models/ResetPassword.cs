using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
    public class ResetPassword
    {
        [Required]
        public string Password { get; set; }

        public string ConfirmPassword { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Token { get; set; } = null!;
    }
}
