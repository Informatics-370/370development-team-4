using System.ComponentModel.DataAnnotations;

namespace BOX.ViewModel
{
    public class UserViewModel
    {
        [StringLength(100)]
        public string emailaddress { get; set; }

        [Required]
        [StringLength(16)]
        public string password { get; set; }

        [Required]
        [StringLength(10)]
        public string phoneNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string firstName { get; set; }

        [Required]
        [StringLength(50)]
        public string lastName { get; set; }

        [Required]
        [StringLength(100)]
        public string address { get; set; }

        [StringLength(4)]
        public string title { get; set; }

        [Required]
        public bool isBusiness { get; set; }

        [Required]
        public string vatNo { get; set; }
    }
}
