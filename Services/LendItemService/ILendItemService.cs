using my_new_app.Dtos.LendItem;
using System;
namespace my_new_app.Services.ItemService
{
	public interface ILendItemService
	{
		Task<ServiceResponse<List<GetLendItemDto>>> GetAllItems();

		Task<ServiceResponse<GetLendItemDto>> GetItemById(int id);

		Task<ServiceResponse<List<GetLendItemDto>>> GetItemsByOwner(string ownerId);
		
		Task<ServiceResponse<GetLendItemDto>> AddNewItem(AddLendItemDto newLendItem);

		Task<ServiceResponse<GetLendItemDto>> UpdateItem(UpdateLendItemDto updateLendItem);

		Task<ServiceResponse<LentItemContainer>> LendItemToUser(string lenderId, string lendeeId, int itemId);

        Task<ServiceResponse<List<GetLendItemDto>>> DeleteItemById(int id);
    }
}

