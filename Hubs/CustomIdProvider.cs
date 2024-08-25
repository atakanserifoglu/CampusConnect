using System;
using Microsoft.AspNetCore.SignalR;

namespace my_new_app.Hubs
{
	public class CustomIdProvider : IUserIdProvider
	{
        public string? GetUserId(HubConnectionContext connection)
        {
	        // Retrieve user ID from query parameters
	        var userId = connection.GetHttpContext()?.Request.Query["userId"];

	        // Set the custom user ID as a claim
	        if (!string.IsNullOrEmpty(userId))
	        {
		        connection.User.AddIdentity(new System.Security.Claims.ClaimsIdentity(new[]
		        {
			        new System.Security.Claims.Claim("UserId", userId)
		        }));
	        }

	        // Return the user ID
	        return userId;
        }
    }
}

