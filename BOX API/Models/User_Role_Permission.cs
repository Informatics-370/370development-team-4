using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace BOX.Models
{
    public class User_Role_Permission
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("UserRole")]
        public string RoleId { get; set; }
        public IdentityRole Role { get; set; }

        [ForeignKey("UserPermission")]
        public int PermissionId { get; set; }
        public User_Permission UserPermission { get; set; }
    }
}
