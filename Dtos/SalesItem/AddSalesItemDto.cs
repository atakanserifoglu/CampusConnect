using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace my_new_app.Dtos.DisplayItem
{
    public class AddSalesItemDto
    {
        public string? userId { get; set; }

        public string? owner { get; set; }

        public string? header { get; set; }

        public string? title { get; set; }

        public string? description { get; set; }

        public string? price { get; set; }

        public Item.ItemType? itemType {get; set;}

        [NotMapped]
        public List<IFormFile>? imageFile { get; set; } = new List<IFormFile>();
    }
}
