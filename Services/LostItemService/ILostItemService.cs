using my_new_app.Dtos.DisplayItem;
using System;
using my_new_app.Dtos.LostItem;
namespace my_new_app.Services.ItemService
{
	public interface ILostItemService
	{
		Task<ServiceResponse<List<GetLostItemDto>>> GetAllItems();

		Task<ServiceResponse<GetLostItemDto>> GetItemById(int id);
		Task<ServiceResponse<List<GetLostItemDto>>> GetItemsByOwner(string ownerId);

		Task<ServiceResponse<GetLostItemDto>> AddNewItem(AddLostItemDto newLostItem);

		Task<ServiceResponse<GetLostItemDto>> UpdateItem(UpdateLostItemDto updateLostItem);

        Task<ServiceResponse<List<GetLostItemDto>>> DeleteItemById(int id);
    }
}

