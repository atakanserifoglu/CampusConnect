using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using my_new_app.Data;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : Controller
    {
        public readonly MyApplicationDbContext _context;
        public readonly UserManager<User> _userManager;
        public DebugController(MyApplicationDbContext dbContext, UserManager<User> userManager)
        {
            _context = dbContext;
            _userManager = userManager;
        }

        [HttpGet("GetUserBorrowedItemsWithLendItem")]
        public async Task<ActionResult<List<User>>> GetUserBorrowedItems2(string id)
        {
            if (ModelState.IsValid)
            {
                var user = await _context.Set<User>().Include(m => m.BorrowedItems).ThenInclude(c => c.LendItem).FirstOrDefaultAsync(m => m.Id == id);
                return Ok(user);
            }
            return NotFound();
        }

        [HttpGet("GetUserLentItemsWithLendItem")]
        public async Task<ActionResult<List<User>>> GetUserLentItems2(string id)
        {
            if (ModelState.IsValid)
            {
                var user = await _context.Set<User>().Include(m => m.LentItems).ThenInclude(c => c.LendItem).FirstOrDefaultAsync(m => m.Id == id);
                return Ok(user);
            }
            return NotFound();
        }

        //[HttpPost("SendMailToUser")]
        //public a
    }
}
