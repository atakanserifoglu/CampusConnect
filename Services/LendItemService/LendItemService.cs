using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using my_new_app.Data;
using my_new_app.Dtos.LendItem;
using System.Linq;
using my_new_app.Repositories;
using my_new_app.Services.ItemService.FileService;
using System.Net.NetworkInformation;
using System.Security.Policy;
using Hangfire;

namespace my_new_app.Services.ItemService
{
	public class LendItemService : ILendItemService
	{
        protected readonly MyApplicationDbContext _context;

        private readonly IItemRepository<LendItem> _repository;

        private readonly IFileService _fileService;

        private readonly IMapper _mapper;

        public LendItemService(IItemRepository<LendItem> repository, IFileService fileService,IMapper mapper, MyApplicationDbContext context)
        {
            _context = context;
            _repository = repository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<GetLendItemDto>>> GetAllItems()
        {
            var serviceResponse = new ServiceResponse<List<GetLendItemDto>>();
            var response = await _repository.GetFiltered(x => x.IsOnLend == false);
            serviceResponse.Data = response.Select(_mapper.Map<GetLendItemDto>).ToList();

            foreach(GetLendItemDto item in serviceResponse.Data)
            {
                if (item.imageName != null && item.imageName.Any())
                {
                    foreach(var name in item.imageName) 
                    {
                        item.imageUrl.Add(_fileService.GetImage(name));
                    }
                }
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetLendItemDto>> GetItemById(int id)
        {
            var serviceResponse = new ServiceResponse<GetLendItemDto>();
            try
            {
                var item = await _repository.GetById(id);
                if (item == null)
                {
                    throw new Exception($"Character with Id {id} not found.");
                }

                var returnItem = _mapper.Map<GetLendItemDto>(item);
                foreach(var name in item.imageName)
                {
                    returnItem.imageUrl.Add(_fileService.GetImage(name));
                }
                serviceResponse.Data = returnItem;
            }
            catch(Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse; 
        }

        public async Task<ServiceResponse<List<GetLendItemDto>>> GetItemsByOwner(string ownerId)
        {
            var serviceResponse = new ServiceResponse<List<GetLendItemDto>>();
            var response = await _repository.GetFiltered(p => p.userId == ownerId);;
            serviceResponse.Data = response.Select(_mapper.Map<GetLendItemDto>).ToList();

            foreach(GetLendItemDto item in serviceResponse.Data)
            {
                if (item.imageName != null && item.imageName.Any())
                {
                    foreach(var name in item.imageName) 
                    {
                        item.imageUrl.Add(_fileService.GetImage(name));
                    }
                }
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetLendItemDto>>  AddNewItem(AddLendItemDto newLendItem)
        {
            var serviceResponse = new ServiceResponse<GetLendItemDto>();
            var item = _mapper.Map<LendItem>(newLendItem);
            item.listDate = DateTime.Now;
            item.IsOnLend = false;
            if (newLendItem.imageFile != null && newLendItem.imageFile.Any())
            {
                foreach(var file in newLendItem.imageFile)
                {
                    var fileResult = await _fileService.SaveImage(file);
                    item.imageName.Add(fileResult.Item2);   // getting name of image 
                }
            }
            await _repository.AddNew(item);
            serviceResponse.Data = _mapper.Map<GetLendItemDto>(item);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetLendItemDto>> UpdateItem(UpdateLendItemDto updateLendItem)
        {
            var serviceResponse = new ServiceResponse<GetLendItemDto>();
            try
            {
                var item = await _repository.GetById(updateLendItem.ID);
                if(item == null)
                {
                    throw new Exception($"Character with Id {updateLendItem.ID} not found.");
                }

                if(updateLendItem.header == null)
                {
                    updateLendItem.header = item.header;
                }
                if (updateLendItem.title == null)
                {
                    updateLendItem.title = item.title;
                }
                if (updateLendItem.description == null)
                {
                    updateLendItem.description = item.description;
                }
                if(updateLendItem.landDurationDays == default)
                {
                    updateLendItem.landDurationDays = item.landDurationDays;
                }

                //Change of photo
                if(updateLendItem.imageFile != null)
                {
                    if(item.imageName != null && item.imageName.Any())
                    {
                        foreach(var name in item.imageName)
                        {
                            await _fileService.DeleteImage(name);
                        }
                    }
                    foreach(var file in updateLendItem.imageFile)
                    {
                        var fileResult = await _fileService.SaveImage(file);
                        item.imageName.Add(fileResult.Item2);
                    }
                }

                _mapper.Map(updateLendItem, item);
                await _repository.UpdateDb();

                serviceResponse.Data = _mapper.Map<GetLendItemDto>(item);
            }
            catch(Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Manuel exception: " + ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<LentItemContainer>> LendItemToUser(string lenderId, string lendeeId, int itemId)
        {
            var serviceResponse = new ServiceResponse<LentItemContainer>();
            try
            {
                var lender = await _context.Set<User>().FindAsync(lenderId);
                var lendee = await _context.Set<User>().FindAsync(lendeeId);
                var item = await _repository.GetById(itemId);
                if(item.IsOnLend == true)
                {
                    throw new Exception("Item is already on Lend");
                }
                item.IsOnLend = true;

                LentItemContainer lentItemContainerLender = new LentItemContainer();
                lentItemContainerLender.LendItem = item;
                lentItemContainerLender.BorrowerId = lendeeId;
                lentItemContainerLender.LentDate = DateTime.Now;
                lender.LentItems.Add(lentItemContainerLender);

                BorrowedItemContainer borrowedItemContainerLendee = new BorrowedItemContainer();
                borrowedItemContainerLendee.LendItem = item;
                borrowedItemContainerLendee.LenderId = lenderId;
                borrowedItemContainerLendee.BorrowDate = DateTime.Now;
                lendee.BorrowedItems.Add(borrowedItemContainerLendee);
                
                await _context.Set<LentItemContainer>().AddAsync(lentItemContainerLender);
                await _context.Set<BorrowedItemContainer>().AddAsync(borrowedItemContainerLendee);

                var fireForgetLenderId = BackgroundJob.Enqueue<IEmailService>(x => x.SendEmail(lender.Email, $"Item with header {item.title} is lent successfuly", $"Your item with header, {item.title} has been successfuly lent to {lendee.Email} for {item.landDurationDays} days."));
                var fireForgetLendeeId = BackgroundJob.Enqueue<IEmailService>(x => x.SendEmail(lendee.Email, $"Item with header {item.title} is borrowed succesfully", $"User {lender.Email} has accepted your borrow request for item with header {item.title}. You have {item.landDurationDays} days to return the item."));
                var jobId = BackgroundJob.Schedule<IEmailService>(x => x.SendEmail(lendee.Email, "YO PHONE LINGIN", "COME PICK UP YO PHONE BRUH :("), TimeSpan.FromDays(item.landDurationDays - 1));

                await _repository.UpdateDb();
                serviceResponse.Data = lentItemContainerLender;
            }
            catch(Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Manuel exception: " + ex.Message;
            }
            return serviceResponse;
        }
        public async Task<ServiceResponse<List<GetLendItemDto>>> DeleteItemById(int id)
        {
            var serviceResponse = new ServiceResponse<List<GetLendItemDto>>();
            try
            {
                var item = await _repository.GetById(id);
                if (item == null)
                {
                    throw new Exception($"Character with Id {id} not found.");
                }
                foreach(var name in item.imageName)
                {
                    await _fileService.DeleteImage(name);
                }
                await _repository.Remove(item);

                var response = await _repository.GetAll();
                serviceResponse.Data = response.Select(_mapper.Map<GetLendItemDto>).ToList();
            }
            catch (Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = ex.Message;
            }
            return serviceResponse;
        }
    }
}

