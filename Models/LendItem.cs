using System;
namespace my_new_app.Models
{
	public class LendItem : Item
	{
		public int landDurationDays { get; set; }

		public bool IsOnLend { get; set; } = false;
    }
}

