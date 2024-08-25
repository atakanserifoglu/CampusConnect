global using my_new_app.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using my_new_app.Services.ItemService;
using my_new_app.Data;
using my_new_app.Dtos.LostItem;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LostItemController : Controller
    {
        private readonly ILostItemService _itemService;

        public LostItemController(ILostItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<ServiceResponse<List<GetLostItemDto>>>> Get()
        {
            return Ok(await _itemService.GetAllItems());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<GetLostItemDto>>> GetSingle(int id)
        {
            var character = await _itemService.GetItemById(id);
            if (character == null)
            {
                return NotFound();
            }

            return Ok(character);
        }

        [HttpPost("Add")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ServiceResponse<GetLostItemDto>>> AddItem([FromForm] AddLostItemDto newLostItem)
        {
            return Ok(await _itemService.AddNewItem(newLostItem));
        }

        [HttpPut("Update")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ServiceResponse<GetLostItemDto>>> UpdateItem([FromForm] UpdateLostItemDto updateLostItem)
        {
            var serviceResponse = await _itemService.UpdateItem(updateLostItem);
            if (!serviceResponse.Success)
            {
                return NotFound(serviceResponse);
            }
            return Ok(serviceResponse);
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<ServiceResponse<List<GetLostItemDto>>>> DeleteItemById(int id)
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

