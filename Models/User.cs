using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using my_new_app.Models;

namespace my_new_app.Models
{
    public class User : IdentityUser
    {
        //public int Id { get; set; }
        //
            
        public string Name { get; set; }

        //public string Email { get; set; }

        public string? RefreshToken { get; set; }

        public DateTime RefreshTokenExpiry { get; set; }

        public string? Description { get; set; }
        public virtual List<ChatRoom>? ChatRooms { get; set; } = new List<ChatRoom>();
        

        public string? ImageName { get; set; }

        public virtual List<BorrowedItemContainer>? BorrowedItems { get; set; } = new List<BorrowedItemContainer>();

        public virtual List<LentItemContainer>? LentItems { get; set; } = new List<LentItemContainer>();

    }
}
