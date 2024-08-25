using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using my_new_app.Models;
using my_new_app.Data;
using Microsoft.EntityFrameworkCore;

namespace my_new_app.Hubs
{
    public struct MessageDTO
    {
        public MessageDTO(string userIdParam, string textParam)
        {
            userId = userIdParam;
            text = textParam;
        }

        public string userId { get; }
        public string text { get; }
    }
    //do not forget to uncomment!!!!!!!!
    //[Authorize]
    public class ChatHub : Hub
    {
        private readonly MyApplicationDbContext _dbcontext;

        public ChatHub(MyApplicationDbContext context)
        {
            _dbcontext = context;
        }

        public override Task OnConnectedAsync()
        {
            //Context.User.AddIdentity();
            return base.OnConnectedAsync();
        }

        public async Task JoinGroup(string chatRoomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId);
            //await Clients.Group(chatRoomId).SendAsync("AddToGroupAsync", $"{Context.ConnectionId} has joined the group {chatRoomId}.");
            
        }

        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("RemoveFromGroupAsync", $"{Context.ConnectionId} has left the group {groupName}.");
        }

        public async Task SendMessageToGroup(string chatRoomId, Message message)
        {
            await Clients.Group(chatRoomId).SendAsync("ReceiveMessageToGroup", $"{Context.ConnectionId}: {message}");
            _dbcontext.Set<Message>().Add(message);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task SendMessageAll(string message)
        {
            await Clients.All.SendAsync("ReceiveMessageAll", $"user with id {Context.ConnectionId} sends message of : {message}");
        }


        public async Task SendMessageToSpesificUser(string senderUserId, string recieverUserId, string message)
        {
            var messageDTO = new MessageDTO(senderUserId, message);
            await Clients.User(recieverUserId).SendAsync("ReceiveMessageBySpesificUser", messageDTO);
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveMessageBySpesificUser", messageDTO);
            //checking wheter chatroom exists
            var chatRoomDb = _dbcontext.Set<ChatRoom>();
            var include = chatRoomDb.Include(c => c.Users);
            var chatRoomList = include.ToList();
            ChatRoom chatRoom;
            if(chatRoomList.Count > 0)
            {
                chatRoom = chatRoomList.FirstOrDefault(c => c.Users[0].Id == senderUserId && c.Users[1].Id == recieverUserId
                                             || c.Users[1].Id == senderUserId && c.Users[0].Id == recieverUserId);
            }
            else
            {
                chatRoom = null;
            }


            if(chatRoom == null)
            {
                //chatroom obj creation and initalization
                chatRoom = new ChatRoom();
                chatRoom.creationDate = DateTime.Now;

                //sünger bob
                var userSender = await (_dbcontext.Set<User>().FindAsync(senderUserId));
                userSender.ChatRooms.Add(chatRoom);
                chatRoom.Users.Add(userSender);


                var userReceiver = await (_dbcontext.Set<User>().FindAsync(recieverUserId));
                userReceiver.ChatRooms.Add(chatRoom);
                chatRoom.Users.Add(userReceiver);

                //message obj creation and initialization 
                var messageObj = new Message();
                messageObj.Text = message;
                messageObj.ChatRoom = chatRoom;
                messageObj.SentDate = DateTime.Now;
                messageObj.UserId = senderUserId;
                /*var userObj = await _dbcontext.Set<User>().FindAsync(senderUserId);
                messageObj.UserName = userObj.Name;*/
                chatRoom.Messages.Add(messageObj);
                await _dbcontext.Set<ChatRoom>().AddAsync(chatRoom);
                await _dbcontext.Set<Message>().AddAsync(messageObj);
            }
            else
            {
                var messageObj = new Message();
                messageObj.Text = message;
                messageObj.ChatRoom = chatRoom;
                messageObj.SentDate = DateTime.Now;
                messageObj.UserId = senderUserId;
                /*var userObj = await _dbcontext.Set<User>().FindAsync(senderUserId);
                messageObj.UserName = userObj.Name;*/
                chatRoom.Messages.Add(messageObj);
                await _dbcontext.Set<Message>().AddAsync(messageObj);
            }
            await _dbcontext.SaveChangesAsync();


        }
        

    }

}

