using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using my_new_app.Data;
using my_new_app.Dtos.DonationItem;
using System.Linq;
using my_new_app.Repositories;
using my_new_app.Services.ItemService.FileService;
using System.Net.NetworkInformation;
using System.Security.Policy;

namespace my_new_app.Services.ItemService
{
	public class DonationItemService : IDonationItemService
	{
        private readonly IItemRepository<DonationItem> _repository;

        private readonly IFileService _fileService;

        private readonly IMapper _mapper;

        public DonationItemService(IItemRepository<DonationItem> repository, IFileService fileService,IMapper mapper)
        {
            _repository = repository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<GetDonationItemDto>>> GetAllItems()
        {
            var serviceResponse = new ServiceResponse<List<GetDonationItemDto>>();
            var response = await _repository.GetAll();
            serviceResponse.Data = response.Select(_mapper.Map<GetDonationItemDto>).ToList();

            foreach(GetDonationItemDto item in serviceResponse.Data)
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

        public async Task<ServiceResponse<GetDonationItemDto>> GetItemById(int id)
        {
            var serviceResponse = new ServiceResponse<GetDonationItemDto>();
            try
            {
                var item = await _repository.GetById(id);
                if (item == null)
                {
                    throw new Exception($"Character with Id {id} not found.");
                }

                var returnItem = _mapper.Map<GetDonationItemDto>(item);
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

        public async Task<ServiceResponse<List<GetDonationItemDto>>> GetItemsByOwner(string ownerId)
        {
            var serviceResponse = new ServiceResponse<List<GetDonationItemDto>>();
            var response = await _repository.GetFiltered(p => p.userId == ownerId);;
            serviceResponse.Data = response.Select(_mapper.Map<GetDonationItemDto>).ToList();

            foreach(GetDonationItemDto item in serviceResponse.Data)
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

        public async Task<ServiceResponse<GetDonationItemDto>>  AddNewItem(AddDonationItemDto newDonationItem)
        {
            var serviceResponse = new ServiceResponse<GetDonationItemDto>();
            var item = _mapper.Map<DonationItem>(newDonationItem);
            item.listDate = DateTime.Now;
            if (newDonationItem.imageFile != null && newDonationItem.imageFile.Any())
            {
                foreach(var file in newDonationItem.imageFile)
                {
                    var fileResult = await _fileService.SaveImage(file);
                    item.imageName.Add(fileResult.Item2);   // getting name of image 
                }
            }
            await _repository.AddNew(item);
            serviceResponse.Data = _mapper.Map<GetDonationItemDto>(item);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetDonationItemDto>> UpdateItem(UpdateDonationItemDto updateDonationItem)
        {
            var serviceResponse = new ServiceResponse<GetDonationItemDto>();
            try
            {
                var item = await _repository.GetById(updateDonationItem.ID);
                if(item == null)
                {
                    throw new Exception($"Character with Id {updateDonationItem.ID} not found.");
                }

                if(updateDonationItem.header == null)
                {
                    updateDonationItem.header = item.header;
                }
                if (updateDonationItem.title == null)
                {
                    updateDonationItem.title = item.title;
                }
                if (updateDonationItem.description == null)
                {
                    updateDonationItem.description = item.description;
                }

                //Change of photo
                if(updateDonationItem.imageFile != null)
                {
                    if(item.imageName != null && item.imageName.Any())
                    {
                        foreach(var name in item.imageName)
                        {
                            await _fileService.DeleteImage(name);
                        }
                    }
                    foreach(var file in updateDonationItem.imageFile)
                    {
                        var fileResult = await _fileService.SaveImage(file);
                        item.imageName.Add(fileResult.Item2);
                    }
                }

                _mapper.Map(updateDonationItem, item);
                await _repository.UpdateDb();

                serviceResponse.Data = _mapper.Map<GetDonationItemDto>(item);
            }
            catch(Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Manuel exception: " + ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetDonationItemDto>>> DeleteItemById(int id)
        {
            var serviceResponse = new ServiceResponse<List<GetDonationItemDto>>();
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
                serviceResponse.Data = response.Select(_mapper.Map<GetDonationItemDto>).ToList();
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

