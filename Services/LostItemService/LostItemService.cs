using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using my_new_app.Data;
using my_new_app.Dtos.LostItem;
using System.Linq;
using my_new_app.Repositories;
using my_new_app.Services.ItemService.FileService;
using System.Net.NetworkInformation;
using System.Security.Policy;

namespace my_new_app.Services.ItemService
{
	public class LostItemService : ILostItemService
	{
        private readonly IItemRepository<LostItem> _repository;

        private readonly IFileService _fileService;

        private readonly IMapper _mapper;

        public LostItemService(IItemRepository<LostItem> repository, IFileService fileService,IMapper mapper)
        {
            _repository = repository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<GetLostItemDto>>> GetAllItems()
        {
            var serviceResponse = new ServiceResponse<List<GetLostItemDto>>();
            var response = await _repository.GetAll();
            serviceResponse.Data = response.Select(_mapper.Map<GetLostItemDto>).ToList();

            foreach(GetLostItemDto item in serviceResponse.Data)
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

        public async Task<ServiceResponse<GetLostItemDto>> GetItemById(int id)
        {
            var serviceResponse = new ServiceResponse<GetLostItemDto>();
            try
            {
                var item = await _repository.GetById(id);
                if (item == null)
                {
                    throw new Exception($"Character with Id {id} not Lost.");
                }

                var returnItem = _mapper.Map<GetLostItemDto>(item);
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

        public async Task<ServiceResponse<List<GetLostItemDto>>> GetItemsByOwner(string ownerId)
        {
            var serviceResponse = new ServiceResponse<List<GetLostItemDto>>();
            var response = await _repository.GetFiltered(p => p.userId == ownerId);;
            serviceResponse.Data = response.Select(_mapper.Map<GetLostItemDto>).ToList();

            foreach(GetLostItemDto item in serviceResponse.Data)
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

        public async Task<ServiceResponse<GetLostItemDto>>  AddNewItem(AddLostItemDto newLostItem)
        {
            var serviceResponse = new ServiceResponse<GetLostItemDto>();
            var item = _mapper.Map<LostItem>(newLostItem);
            item.listDate = DateTime.Now;
            if (newLostItem.imageFile != null && newLostItem.imageFile.Any())
            {
                foreach(var file in newLostItem.imageFile)
                {
                    var fileResult = await _fileService.SaveImage(file);
                    item.imageName.Add(fileResult.Item2);   // getting name of image 
                }
            }
            await _repository.AddNew(item);
            serviceResponse.Data = _mapper.Map<GetLostItemDto>(item);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetLostItemDto>> UpdateItem(UpdateLostItemDto updateLostItem)
        {
            var serviceResponse = new ServiceResponse<GetLostItemDto>();
            try
            {
                var item = await _repository.GetById(updateLostItem.ID);
                if(item == null)
                {
                    throw new Exception($"Character with Id {updateLostItem.ID} not Lost.");
                }

                if(updateLostItem.header == null)
                {
                    updateLostItem.header = item.header;
                }
                if (updateLostItem.title == null)
                {
                    updateLostItem.title = item.title;
                }
                if (updateLostItem.description == null)
                {
                    updateLostItem.description = item.description;
                }

                //Change of photo
                if(updateLostItem.imageFile != null)
                {
                    if(item.imageName != null && item.imageName.Any())
                    {
                        foreach(var name in item.imageName)
                        {
                            await _fileService.DeleteImage(name);
                        }
                    }
                    foreach(var file in updateLostItem.imageFile)
                    {
                        var fileResult = await _fileService.SaveImage(file);
                        item.imageName.Add(fileResult.Item2);
                    }
                }

                _mapper.Map(updateLostItem, item);
                await _repository.UpdateDb();

                serviceResponse.Data = _mapper.Map<GetLostItemDto>(item);
            }
            catch(Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Manuel exception: " + ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetLostItemDto>>> DeleteItemById(int id)
        {
            var serviceResponse = new ServiceResponse<List<GetLostItemDto>>();
            try
            {
                var item = await _repository.GetById(id);
                if (item == null)
                {
                    throw new Exception($"Character with Id {id} not Lost.");
                }
                foreach(var name in item.imageName)
                {
                    await _fileService.DeleteImage(name);
                }
                await _repository.Remove(item);

                var response = await _repository.GetAll();
                serviceResponse.Data = response.Select(_mapper.Map<GetLostItemDto>).ToList();
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

