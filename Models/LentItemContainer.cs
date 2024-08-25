using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace my_new_app.Models
{
	public class LentItemContainer
	{
        [Key]
        public int Id { get; set; }

        public LendItem LendItem { get; set; }
        public int LendItemId { get; set; }

        public string? BorrowerId { get; set; }

        public DateTime LentDate { get; set; }
    }
}

