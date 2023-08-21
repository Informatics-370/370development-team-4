using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BOX.Models
{
    public class Title
    {
        [Key] public int TitleID { get; set; }
        [Required][MaxLength(10)]public string Description { get; set; } = string.Empty;
    }
}
