using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
namespace my_new_app.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Text { get; set; }

        public DateTime SentDate { get; set; }

        public string UserId { get; set; }

        public User? User { get; set; }

        public virtual ChatRoom? ChatRoom { get; set; }

        public int ChatRoomId { get; set; }
    }
}

