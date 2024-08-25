using my_new_app.Dtos.DisplayItem;
using System;
using my_new_app.Dtos.FoundItem;
namespace my_new_app.Services.ItemService
{
	public interface IFoundItemService
	{
		Task<ServiceResponse<List<GetFoundItemDto>>> GetAllItems();

		Task<ServiceResponse<GetFoundItemDto>> GetItemById(int id);
		Task<ServiceResponse<List<GetFoundItemDto>>> GetItemsByOwner(string ownerId);

		Task<ServiceResponse<GetFoundItemDto>> AddNewItem(AddFoundItemDto newFoundItem);

		Task<ServiceResponse<GetFoundItemDto>> UpdateItem(UpdateFoundItemDto updateFoundItem);

        Task<ServiceResponse<List<GetFoundItemDto>>> DeleteItemById(int id);
    }
}

