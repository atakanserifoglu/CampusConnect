using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using System.Diagnostics;
using my_new_app.Models;
using Microsoft.EntityFrameworkCore;
using my_new_app.Data;
using Microsoft.AspNetCore.Identity;

namespace my_new_app.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : Controller
	{
        public readonly MyApplicationDbContext _context;
        public readonly UserManager<User> _userManager;
		public ChatController(MyApplicationDbContext dbContext, UserManager<User> userManager)
        {
            _context = dbContext;
            _userManager = userManager;
        }

        [HttpGet("GetUserChatRooms")]
        public async Task<ActionResult<List<ChatRoom>>> GetUserChatRooms(string id)
        {
            if (ModelState.IsValid)
            {
                var user = await _context.Set<User>().Include(m => m.ChatRooms).ThenInclude(c => c.Users).FirstOrDefaultAsync(m => m.Id == id); ;
                var chatRooms = user.ChatRooms;
                return Ok(chatRooms);
            }
            return NotFound();
        }
        [HttpGet("GetChatRoomWithMessages")]
        public async Task<ActionResult<ChatRoom>> TestDos(int id)
        {
            if (ModelState.IsValid)
            {
                var chatRoom = await _context.Set<ChatRoom>().Include(c => c.Messages).FirstOrDefaultAsync(c => c.Id == id);
                return Ok(chatRoom);
            }
            return NotFound();
        }
        [HttpGet("GetChatRoomWithUsers")]
        public async Task<ActionResult<ServiceResponse<ChatRoom>>> UserChatRoom(int id)
        {
            if (ModelState.IsValid)
            {
                var response = new ServiceResponse<ChatRoom>();
                var chatRoom = await _context.Set<ChatRoom>().Include(c => c.Users).FirstOrDefaultAsync(c => c.Id == id);
                response.Data = chatRoom;
                return Ok(response);
            }
            return NotFound();
        }
        [HttpGet("GetChatRoomComplete")]
        public async Task<ActionResult<ServiceResponse<ChatRoom>>> ChatRoomComplete(int id)
        {
            if (ModelState.IsValid)
            {
                var response = new ServiceResponse<ChatRoom>();
                var chatRoom = await _context.Set<ChatRoom>().Include(c => c.Users).Include(c => c.Messages).FirstOrDefaultAsync(c => c.Id == id);
                response.Data = chatRoom;
                return Ok(response);
            }
            return NotFound();
        }

        [HttpGet("GetUserContacts")]
        public async Task<ActionResult<List<User>>> GetUserContacts(string id)
        {
            if (ModelState.IsValid)
            {
                var user = await _context.Set<User>().Include(m => m.ChatRooms).ThenInclude(c => c.Users).FirstOrDefaultAsync(m => m.Id == id); ;
                var chatRooms = user.ChatRooms;
                List<User> contacts = new List<User>();
                foreach(ChatRoom chatRoom in chatRooms)
                {
                    if (chatRoom.Users[0].Id == id)
                    {
                        contacts.Add(chatRoom.Users[0]);
                    }
                    else
                    {
                        contacts.Add(chatRoom.Users[1]);
                    }
                }
                return Ok(contacts);
            }
            return NotFound();
        }
        /*[HttpPost("CreateChatRoom")]
        public async Task<IActionResult> AddChatRoomWithMessage(ChatRoom chatRoomq Message message)
        {
            chatRoom.Messages.Add(message);
            _context.ChatRooms.Add(chatRoom);
            _context.SaveChanges();
            return Ok();
        }*/
    }
}



