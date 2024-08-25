using AutoMapper;
using my_new_app.Dtos.DisplayItem;
using my_new_app.Dtos.DonationItem;
using my_new_app.Dtos.LendItem;
using my_new_app.Dtos.FoundItem;
using my_new_app.Dtos.LostItem;
using my_new_app.Models;

namespace my_new_app.Dtos
{
    public class AutoMapperProfile : Profile 
    {
        public AutoMapperProfile()
        {
            //Sales Item
            CreateMap<Models.SalesItem, GetSalesItemDto>();
            CreateMap<AddSalesItemDto, Models.SalesItem>();
            CreateMap<AddSalesItemDto, GetSalesItemDto>();
            CreateMap<UpdateSalesItemDto, Models.SalesItem>();

            //Donation Item
            CreateMap<Models.DonationItem, GetDonationItemDto>();
            CreateMap<AddDonationItemDto, Models.DonationItem>();
            CreateMap<AddDonationItemDto, GetDonationItemDto>();
            CreateMap<UpdateDonationItemDto, Models.DonationItem>();

            //Lend Item
            CreateMap<Models.LendItem, GetLendItemDto>();
            CreateMap<AddLendItemDto, Models.LendItem>();
            CreateMap<AddLendItemDto, GetLendItemDto>();
            CreateMap<UpdateLendItemDto, Models.LendItem>();

            //Found Item
            CreateMap<Models.FoundItem, GetFoundItemDto>();
            CreateMap<AddFoundItemDto, Models.FoundItem>();
            CreateMap<AddFoundItemDto, GetFoundItemDto>();
            CreateMap<UpdateFoundItemDto, Models.FoundItem>();

            //Lost Item
            CreateMap<Models.LostItem, GetLostItemDto>();
            CreateMap<AddLostItemDto, Models.LostItem>();
            CreateMap<AddLostItemDto, GetLostItemDto>();
            CreateMap<UpdateLostItemDto, Models.LostItem>();
        }
    }
}
