using my_new_app.Dtos.DisplayItem;
using my_new_app.Dtos.DonationItem;
using my_new_app.Dtos.LendItem;

namespace my_new_app.Models;

public class ItemContainer
{
    public ServiceResponse<List<GetSalesItemDto>> SalesItemList { get; set; }
    public ServiceResponse<List<GetDonationItemDto>> DonationItemList { get; set; }
    public ServiceResponse<List<GetLendItemDto>> LendItemList { get; set; }

    public ItemContainer(ServiceResponse<List<GetSalesItemDto>> salesItems,ServiceResponse<List<GetDonationItemDto>> donationItems, ServiceResponse<List<GetLendItemDto>> lendItems)
    {
        SalesItemList = salesItems;
        DonationItemList = donationItems;
        LendItemList = lendItems;
    }
}