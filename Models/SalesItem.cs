using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace my_new_app.Models
{
	public class SalesItem : Item
	{
		public string? price { get; set; }
	}
}


