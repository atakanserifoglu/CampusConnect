using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using my_new_app.Data;
using my_new_app.Dtos.DisplayItem;
using my_new_app.Repositories;
using my_new_app.Services.ItemService;

namespace my_new_app.Controllers;

[ApiController]
[Route("api/[controller]")]

public class GeneralItemController : ControllerBase
{
    private MyApplicationDbContext _context;
    private readonly ISalesItemService _salesItemService;
    private readonly IDonationItemService _donationItemService;
    private readonly ILendItemService _lendItemService;

    public GeneralItemController(ISalesItemService itemService,IDonationItemService donationService, ILendItemService lendService, MyApplicationDbContext context)
    {
        _context = context;
        _salesItemService = itemService;
        _donationItemService = donationService;
        _lendItemService = lendService;
    }

    [HttpGet("{ownerId}")]
    public async Task<ActionResult<ServiceResponse<ItemContainer>>> GetItemsByOwner(string ownerId)
    {
        var serviceResponse = new ServiceResponse<ItemContainer>();
        var salesItems = await _salesItemService.GetItemsByOwner(ownerId);
        var donationItems = await _donationItemService.GetItemsByOwner(ownerId);
        var lendItems  = await _lendItemService.GetItemsByOwner(ownerId);

        ItemContainer container = new ItemContainer(salesItems, donationItems, lendItems);
        serviceResponse.Data = container;
        return Ok(serviceResponse);
    }

    [HttpGet("GetUserBorrowedItems")]
    public async Task<ActionResult<List<User>>> GetUserBorrowedItems2(string id)
    {
        if (ModelState.IsValid)
        {
            var user = await _context.Set<User>().Include(m => m.BorrowedItems).ThenInclude(c => c.LendItem).FirstOrDefaultAsync(m => m.Id == id);
            return Ok(user);
        }
        return NotFound();
    }

    [HttpGet("GetUserLentItems")]
    public async Task<ActionResult<List<User>>> GetUserLentItems2(string id)
    {
        if (ModelState.IsValid)
        {
            var user = await _context.Set<User>().Include(m => m.LentItems).ThenInclude(c => c.LendItem).FirstOrDefaultAsync(m => m.Id == id);
            return Ok(user);
        }
        return NotFound();
    }
}
