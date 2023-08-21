using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace BOX.Models
{
    public class Price_Match_File
    {
        [Key] public int PriceMatchFileID { get; set; }
        [Required] public byte[] File { get; set; }
    }
}
