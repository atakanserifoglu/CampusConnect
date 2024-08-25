using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using my_new_app.Data;
using my_new_app.Dtos.FoundItem;
using System.Linq;
using my_new_app.Repositories;
using my_new_app.Services.ItemService.FileService;
using System.Net.NetworkInformation;
using System.Security.Policy;

namespace my_new_app.Services.ItemService
{
	public class FoundItemService : IFoundItemService
	{
        private readonly IItemRepository<FoundItem> _repository;

        private readonly IFileService _fileService;

        private readonly IMapper _mapper;

        public FoundItemService(IItemRepository<FoundItem> repository, IFileService fileService,IMapper mapper)
        {
            _repository = repository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<GetFoundItemDto>>> GetAllItems()
        {
            var serviceResponse = new ServiceResponse<List<GetFoundItemDto>>();
            var response = await _repository.GetAll();
            serviceResponse.Data = response.Select(_mapper.Map<GetFoundItemDto>).ToList();

            foreach(GetFoundItemDto item in serviceResponse.Data)
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

        public async Task<ServiceResponse<GetFoundItemDto>> GetItemById(int id)
        {
            var serviceResponse = new ServiceResponse<GetFoundItemDto>();
            try
            {
                var item = await _repository.GetById(id);
                if (item == null)
                {
                    throw new Exception($"Character with Id {id} not found.");
                }

                var returnItem = _mapper.Map<GetFoundItemDto>(item);
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

        public async Task<ServiceResponse<List<GetFoundItemDto>>> GetItemsByOwner(string ownerId)
        {
            var serviceResponse = new ServiceResponse<List<GetFoundItemDto>>();
            var response = await _repository.GetFiltered(p => p.userId == ownerId);;
            serviceResponse.Data = response.Select(_mapper.Map<GetFoundItemDto>).ToList();

            foreach(GetFoundItemDto item in serviceResponse.Data)
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

        public async Task<ServiceResponse<GetFoundItemDto>>  AddNewItem(AddFoundItemDto newFoundItem)
        {
            var serviceResponse = new ServiceResponse<GetFoundItemDto>();
            var item = _mapper.Map<FoundItem>(newFoundItem);
            item.listDate = DateTime.Now;
            if (newFoundItem.imageFile != null && newFoundItem.imageFile.Any())
            {
                foreach(var file in newFoundItem.imageFile)
                {
                    var fileResult = await _fileService.SaveImage(file);
                    item.imageName.Add(fileResult.Item2);   // getting name of image 
                }
            }
            await _repository.AddNew(item);
            serviceResponse.Data = _mapper.Map<GetFoundItemDto>(item);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetFoundItemDto>> UpdateItem(UpdateFoundItemDto updateFoundItem)
        {
            var serviceResponse = new ServiceResponse<GetFoundItemDto>();
            try
            {
                var item = await _repository.GetById(updateFoundItem.ID);
                if(item == null)
                {
                    throw new Exception($"Character with Id {updateFoundItem.ID} not found.");
                }

                if(updateFoundItem.header == null)
                {
                    updateFoundItem.header = item.header;
                }
                if (updateFoundItem.title == null)
                {
                    updateFoundItem.title = item.title;
                }
                if (updateFoundItem.description == null)
                {
                    updateFoundItem.description = item.description;
                }

                //Change of photo
                if(updateFoundItem.imageFile != null)
                {
                    if(item.imageName != null && item.imageName.Any())
                    {
                        foreach(var name in item.imageName)
                        {
                            await _fileService.DeleteImage(name);
                        }
                    }
                    foreach(var file in updateFoundItem.imageFile)
                    {
                        var fileResult = await _fileService.SaveImage(file);
                        item.imageName.Add(fileResult.Item2);
                    }
                }

                _mapper.Map(updateFoundItem, item);
                await _repository.UpdateDb();

                serviceResponse.Data = _mapper.Map<GetFoundItemDto>(item);
            }
            catch(Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Manuel exception: " + ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetFoundItemDto>>> DeleteItemById(int id)
        {
            var serviceResponse = new ServiceResponse<List<GetFoundItemDto>>();
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
                serviceResponse.Data = response.Select(_mapper.Map<GetFoundItemDto>).ToList();
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

