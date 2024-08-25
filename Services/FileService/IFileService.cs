using System;
namespace my_new_app.Services.ItemService.FileService
{
    public interface IFileService
    {
        Task<Tuple<int, string>> SaveImage(IFormFile imageFile, PhotoType photoType = PhotoType.itemPhoto);
        string GetImage(string imageFileName, PhotoType photoType = PhotoType.itemPhoto);
        Task<bool> DeleteImage(string imageFileName, PhotoType photoType = PhotoType.itemPhoto);
    }
}

