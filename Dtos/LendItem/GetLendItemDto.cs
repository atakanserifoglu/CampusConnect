using System;
namespace my_new_app.Dtos.LendItem
{
	public class GetLendItemDto
	{
        public int ID { get; set; }

        public string? userId { get; set; }

        public DateTime listDate { get; set; }

        public string? owner { get; set; }

        public string? header { get; set; }

        public string? title { get; set; }

        public string? description { get; set; }

        public int landDurationDays { get; set; }

        public bool IsOnLend { get; set; } = false;

        public Item.ItemType? itemType { get; set; }

        public List<string>? imageName { get; set; } = new List<string>();

        public List<string>? imageUrl { get; set; } = new List<string>();
    }
}

