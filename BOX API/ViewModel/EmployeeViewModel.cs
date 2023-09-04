using System.ComponentModel.DataAnnotations;

namespace BOX.ViewModel
{
    public class EmployeeViewModel
    {
        [StringLength(100)]
        public string emailaddress { get; set; }

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

        [Required]
        public int title { get; set; }
    }
}
