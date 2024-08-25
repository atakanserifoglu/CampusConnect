using Microsoft.AspNetCore.Mvc;
using my_new_app.Dtos.LendItem;
using my_new_app.Services.ItemService;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LendItemController : Controller
    {
        private readonly ILendItemService _itemService;

        public LendItemController(ILendItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<ServiceResponse<List<GetLendItemDto>>>> Get()
        {
            return Ok(await _itemService.GetAllItems());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<GetLendItemDto>>> GetSingle(int id)
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
        public async Task<ActionResult<ServiceResponse<GetLendItemDto>>> AddItem([FromForm] AddLendItemDto newLendItem)
        {
            return Ok(await _itemService.AddNewItem(newLendItem));
        }

        [HttpPut("Update")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ServiceResponse<GetLendItemDto>>> UpdateItem([FromForm] UpdateLendItemDto updateLendItem)
        {
            var serviceResponse = await _itemService.UpdateItem(updateLendItem);
            if (!serviceResponse.Success)
            {
                return NotFound(serviceResponse);
            }
            return Ok(serviceResponse);
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<ServiceResponse<List<GetLendItemDto>>>> DeleteItemById(int id)
        {
            var serviceResponse = await _itemService.DeleteItemById(id);
            if (!serviceResponse.Success)
            {
                return NotFound(serviceResponse);
            }
            return Ok(serviceResponse);
        }

        [HttpGet("LendItemToUser")]
        public async Task<ActionResult<ServiceResponse<LentItemContainer>>> LendItemToUser(string lenderId, string lendeeId, int itemId)
        {
            var serviceResponse = await _itemService.LendItemToUser(lenderId, lendeeId, itemId);
            if (!serviceResponse.Success)
            {
                return NotFound(serviceResponse);
            }
            return Ok(serviceResponse);
        }
    }
}