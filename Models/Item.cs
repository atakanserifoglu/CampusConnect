using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace my_new_app.Models
{
	public class Item 
	{
        public enum ItemType
        {
            salesItem,
            lendItem,
            donateItem,
        }
        [Key]
        public int ID { get; set; }

        public string? userId { get; set; }

        public DateTime listDate { get; set; } = DateTime.Now;

        public string? owner { get; set; }

        public string? header { get; set; }

        public string? title { get; set; }

        public string? description { get; set; }

        public ItemType? itemType { get; set; }

        public List<string>? imageName { get; set; } = new List<string>();
    }
}

