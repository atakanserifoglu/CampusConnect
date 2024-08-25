using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace my_new_app.Models
{
	public class ChatRoom
	{
        [Key]
        public int Id { get; set; }

        public DateTime creationDate { get; set; }
        public virtual List<User>? Users { get; set; } = new List<User>();
        public virtual List<Message>? Messages { get; set; } = new List<Message>();

        //public string firstUserId { get; set; }
        //public virtual User firstUser { get; set; }
        //public string secondUserId { get; set; }
        //public virtual User secondUser { get; set; }
    }
}

