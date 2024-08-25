using System;
using Azure.Storage.Blobs;
namespace my_new_app.Services.ItemService.FileService
{
    public enum PhotoType
    {
        itemPhoto,
        profilePhoto
    }
    public class FileService : IFileService
    {
        private readonly string _storageKey = "DefaultEndpointsProtocol=https;AccountName=bilcampusstorage;AccountKey=6PFlXVVcpPIee6jRHLS+TAUu2tebJAwF+OLQIEoxYdZAmZtpkksVWiSj0wr8b+BPrCkpPhIjsNWo+AStOoisRg==;EndpointSuffix=core.windows.net";
        private readonly string _itemPhotoContainerName = "images";
        private readonly string _profilePhotoContainerName = "profilepictures";
        private BlobContainerClient _itemPhotoContainer;
        private BlobContainerClient _profilePhotoContainer;
        public FileService()
        {
            _itemPhotoContainer = new BlobContainerClient(_storageKey, _itemPhotoContainerName);
            _profilePhotoContainer = new BlobContainerClient(_storageKey, _profilePhotoContainerName);
            
        }

        public async Task<Tuple<int, string>> SaveImage(IFormFile imageFile, PhotoType photoType = PhotoType.itemPhoto)
        {
            try
            {
                BlobContainerClient container;
                if(photoType == PhotoType.profilePhoto)
                {
                    container = _profilePhotoContainer;
                }
                else
                {
                    container = _itemPhotoContainer;
                }
                // Check the allowed extenstions
                var ext = Path.GetExtension(imageFile.FileName);
                var allowedExtensions = new string[] { ".jpg", ".png", ".jpeg" };
                if (!allowedExtensions.Contains(ext))
                {
                    string msg = string.Format("Only {0} extensions are allowed", string.Join(",", allowedExtensions));
                    return new Tuple<int, string>(0, msg);
                }

                string uniqueString = Guid.NewGuid().ToString();
                // we are trying to create a unique filename here
                var newFileName = uniqueString + ext;

                var blob = container.GetBlobClient(newFileName);
                await using (Stream? data = imageFile.OpenReadStream())
                {
                    await blob.UploadAsync(data);
                }

                return new Tuple<int, string>(1, newFileName);
            }
            catch (Exception ex)
            {
                return new Tuple<int, string>(0, ex.ToString());
            }
        }

        public string GetImage(string imageFileName, PhotoType photoType = PhotoType.itemPhoto)
        {
            BlobContainerClient container;
            if (photoType == PhotoType.profilePhoto)
            {
                container = _profilePhotoContainer;
            }
            else
            {
                container = _itemPhotoContainer;
            }
            BlobClient file = container.GetBlobClient(imageFileName);
            var uri = file.Uri.ToString();
            return uri;
        }

        public async Task<bool> DeleteImage(string imageFileName, PhotoType photoType = PhotoType.itemPhoto)
        {
            try
            {
                BlobContainerClient container;
                if (photoType == PhotoType.profilePhoto)
                {
                    container = _profilePhotoContainer;
                }
                else
                {
                    container = _itemPhotoContainer;
                }
                BlobClient file = container.GetBlobClient(imageFileName);
                await file.DeleteIfExistsAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}

