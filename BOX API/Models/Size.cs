﻿using System.ComponentModel.DataAnnotations;

namespace BOX.Models
{//Hello world
	public class Size
	{
		[Key] public int SizeID { get; set; }
		[Required] public decimal Width { get; set; }
		[Required] public decimal Height { get; set; }
		[Required] public decimal Length { get; set; }
		[Required] public decimal Weight { get; set; }
		[Required] public decimal Volume { get; set; }
		//Random comment. Testing 8, 8, 8
	}
}
//For the sake of simplicity I will be editing the Size class with a comment so that it does not change the integrity or data of anything in this class. I will be pushing this to dev but there must be a whole pull request process, which I am still figuring out-- Kuziwa

//boom bam
