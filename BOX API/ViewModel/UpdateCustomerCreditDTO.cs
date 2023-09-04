using System.ComponentModel.DataAnnotations;

namespace BOX.ViewModel
{
    public class UpdateCustomerCreditDTO
    {
        [Required]
        public string Email { get; set; }

        public decimal? CreditLimit { get; set; }

        public decimal? CreditBalance { get; set; }
    }

}
