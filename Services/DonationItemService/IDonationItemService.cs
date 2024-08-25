using my_new_app.Dtos.DisplayItem;
using System;
using my_new_app.Dtos.DonationItem;
namespace my_new_app.Services.ItemService
{
	public interface IDonationItemService
	{
		Task<ServiceResponse<List<GetDonationItemDto>>> GetAllItems();

		Task<ServiceResponse<GetDonationItemDto>> GetItemById(int id);
		Task<ServiceResponse<List<GetDonationItemDto>>> GetItemsByOwner(string ownerId);

		Task<ServiceResponse<GetDonationItemDto>> AddNewItem(AddDonationItemDto newDonationItem);

		Task<ServiceResponse<GetDonationItemDto>> UpdateItem(UpdateDonationItemDto updateDonationItem);

        Task<ServiceResponse<List<GetDonationItemDto>>> DeleteItemById(int id);
    }
}

