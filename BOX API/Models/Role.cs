using System;
using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{
    public class Role
    {
        [Key]
        public int RoleID { get; set; }

        [Required]
        [MaxLength(50)]
        public string Description { get; set; } = string.Empty;
    }
}
