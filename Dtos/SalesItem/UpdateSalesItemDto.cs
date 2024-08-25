namespace my_new_app.Dtos.DisplayItem
{
    public class UpdateSalesItemDto
    {
        public int ID { get; set; }

        public string? header { get; set; }

        public string? title { get; set; }

        public string? description { get; set; }

        public string? price { get; set; }

        public List<IFormFile>? imageFile { get; set; } = new List<IFormFile>();
    }
}
