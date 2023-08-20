using BOX.Controllers;
using Org.BouncyCastle.Asn1.Mozilla;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Foolproof;

namespace BOX.Models
{
    public class Customer
    {
        [Required]
        public string CustomerId { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual User User { get; set; }

        [Required]
        [ForeignKey("Employee")]
        public string? EmployeeId { get; set; }
        public virtual Employee Employee { get; set; }

        [Required]
        public bool isBusiness { get; set; }

        [StringLength(10)]
        public string? vatNo { get; set; }

        public decimal? creditLimit { get; set; }

        public decimal? creditBalance { get; set; }

        public decimal? discount { get; set; }


    }
}
