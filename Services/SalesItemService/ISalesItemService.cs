using my_new_app.Dtos.DisplayItem;
using System;
namespace my_new_app.Services.ItemService
{
	public interface ISalesItemService
	{
		Task<ServiceResponse<List<GetSalesItemDto>>> GetAllItems();

		Task<ServiceResponse<GetSalesItemDto>> GetItemById(int id);
		
		Task<ServiceResponse<List<GetSalesItemDto>>> GetItemsByOwner(string ownerId);

		Task<ServiceResponse<GetSalesItemDto>> AddNewItem(AddSalesItemDto newSalesItem);

		Task<ServiceResponse<GetSalesItemDto>> UpdateItem(UpdateSalesItemDto updateSalesItem);

        Task<ServiceResponse<List<GetSalesItemDto>>> DeleteItemById(int id);
    }
}

