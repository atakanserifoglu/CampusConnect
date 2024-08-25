
global using my_new_app.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using my_new_app.Services.ItemService;
using my_new_app.Data;
using my_new_app.Dtos.DisplayItem;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesItemController : Controller
    {
        private readonly ISalesItemService _itemService;

        public SalesItemController(ISalesItemService itemService)
        {
            _itemService = itemService;
        } 

        [HttpGet("GetAll")]
        public async Task<ActionResult<ServiceResponse<List<GetSalesItemDto>>>>  Get()
        {
            return Ok(await _itemService.GetAllItems());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<GetSalesItemDto>>> GetSingle(int id)
        {
            var character = await _itemService.GetItemById(id); 
            if(character == null)
            {
                return NotFound();
            }

            return Ok(character);
        }
        
        [HttpGet("GetByOwner/{ownerId}")]
        public ActionResult<IEnumerable<SalesItem>> GetSalesItemsByOwner(string ownerId)
        {
            var items = _itemService.GetItemsByOwner(ownerId);
            return Ok(items);
        }
        

        [HttpPost("Add")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ServiceResponse<GetSalesItemDto>>> AddItem([FromForm]AddSalesItemDto newSalesItem)
        {
            return Ok(await _itemService.AddNewItem(newSalesItem));
        }

        [HttpPut("Update")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ServiceResponse<GetSalesItemDto>>> UpdateItem([FromForm]UpdateSalesItemDto updateSalesItem)
        {
            var serviceResponse = await _itemService.UpdateItem(updateSalesItem);
            if (!serviceResponse.Success)
            {
                return NotFound(serviceResponse);
            }
            return Ok(serviceResponse); 
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<ServiceResponse<List<GetSalesItemDto>>>> DeleteItemById(int id)
        {
            var serviceResponse = await _itemService.DeleteItemById(id);
            if (!serviceResponse.Success)
            {
                return NotFound(serviceResponse);
            }
            return Ok(serviceResponse);
        }
    }
}

