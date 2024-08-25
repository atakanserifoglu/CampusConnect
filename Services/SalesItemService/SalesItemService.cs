using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using my_new_app.Data;
using my_new_app.Dtos.DisplayItem;
using System.Linq;
using my_new_app.Repositories;
using my_new_app.Services.ItemService.FileService;
using System.Net.NetworkInformation;
using System.Security.Policy;

namespace my_new_app.Services.ItemService
{
	public class SalesItemService : ISalesItemService
	{
        private readonly IItemRepository<SalesItem> _repository;

        private readonly IFileService _fileService;

        private readonly IMapper _mapper;

        public SalesItemService(IItemRepository<SalesItem> repository, IFileService fileService,IMapper mapper)
        {
            _repository = repository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<ServiceResponse<List<GetSalesItemDto>>> GetAllItems()
        {
            var serviceResponse = new ServiceResponse<List<GetSalesItemDto>>();
            var response = await _repository.GetAll();
            serviceResponse.Data = response.Select(_mapper.Map<GetSalesItemDto>).ToList();

            foreach(GetSalesItemDto item in serviceResponse.Data)
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

        public async Task<ServiceResponse<GetSalesItemDto>> GetItemById(int id)
        {
            var serviceResponse = new ServiceResponse<GetSalesItemDto>();
            try
            {
                var item = await _repository.GetById(id);
                if (item == null)
                {
                    throw new Exception($"Character with Id {id} not found.");
                }

                var returnItem = _mapper.Map<GetSalesItemDto>(item);
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
        
        public async Task<ServiceResponse<List<GetSalesItemDto>>> GetItemsByOwner(string ownerId)
        {
            var serviceResponse = new ServiceResponse<List<GetSalesItemDto>>();
            var response = await _repository.GetFiltered(p => p.userId == ownerId);;
            serviceResponse.Data = response.Select(_mapper.Map<GetSalesItemDto>).ToList();

            foreach(GetSalesItemDto item in serviceResponse.Data)
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

        public async Task<ServiceResponse<GetSalesItemDto>>  AddNewItem(AddSalesItemDto newSalesItem)
        {
            var serviceResponse = new ServiceResponse<GetSalesItemDto>();
            var item = _mapper.Map<SalesItem>(newSalesItem);
            item.listDate = DateTime.Now;
            if (newSalesItem.imageFile != null && newSalesItem.imageFile.Any())
            {
                foreach(var file in newSalesItem.imageFile)
                {
                    var fileResult = await _fileService.SaveImage(file);
                    item.imageName.Add(fileResult.Item2);   // getting name of image 
                }
            }
            await _repository.AddNew(item);
            serviceResponse.Data = _mapper.Map<GetSalesItemDto>(item);
            return serviceResponse;
        }

        public async Task<ServiceResponse<GetSalesItemDto>> UpdateItem(UpdateSalesItemDto updateSalesItem)
        {
            var serviceResponse = new ServiceResponse<GetSalesItemDto>();
            try
            {
                var item = await _repository.GetById(updateSalesItem.ID);
                if(item == null)
                {
                    throw new Exception($"Character with Id {updateSalesItem.ID} not found.");
                }

                if(updateSalesItem.header == null)
                {
                    updateSalesItem.header = item.header;
                }
                if (updateSalesItem.title == null)
                {
                    updateSalesItem.title = item.title;
                }
                if (updateSalesItem.description == null)
                {
                    updateSalesItem.description = item.description;
                }
                if(updateSalesItem.price == null)
                {
                    updateSalesItem.price = item.price;
                }

                //Change of photo
                if(updateSalesItem.imageFile != null)
                {
                    if(item.imageName != null && item.imageName.Any())
                    {
                        foreach(var name in item.imageName)
                        {
                            await _fileService.DeleteImage(name);
                        }
                    }
                    foreach(var file in updateSalesItem.imageFile)
                    {
                        var fileResult = await _fileService.SaveImage(file);
                        item.imageName.Add(fileResult.Item2);
                    }
                }

                _mapper.Map(updateSalesItem, item);
                await _repository.UpdateDb();

                serviceResponse.Data = _mapper.Map<GetSalesItemDto>(item);
            }
            catch(Exception ex)
            {
                serviceResponse.Success = false;
                serviceResponse.Message = "Manuel exception: " + ex.Message;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<List<GetSalesItemDto>>> DeleteItemById(int id)
        {
            var serviceResponse = new ServiceResponse<List<GetSalesItemDto>>();
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
                serviceResponse.Data = response.Select(_mapper.Map<GetSalesItemDto>).ToList();
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

