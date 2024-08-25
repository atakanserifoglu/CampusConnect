using System;
using my_new_app.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Reflection.Metadata;

namespace my_new_app.Data
{
    public class MyApplicationDbContext : IdentityDbContext
    {

        public MyApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<SalesItem> SalesItem { get; set; }
        public DbSet<DonationItem> DonationItem { get; set; }
        public DbSet<LendItem> LendItem { get; set; }
        public DbSet<LostItem> LostItems { get; set; }
        public DbSet<FoundItem> FoundItems { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<BorrowedItemContainer> BorrowedItemContainers { get; set; }
        public DbSet<LentItemContainer> LentItemContainers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<SalesItem>()
            .Property(e => e.imageName)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<DonationItem>()
            .Property(e => e.imageName)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<LendItem>()
            .Property(e => e.imageName)
            .HasConversion(
            v => string.Join(',', v),
            v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<FoundItem>()
            .Property(e => e.imageName)
            .HasConversion(
            v => string.Join(',', v),
            v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            modelBuilder.Entity<LostItem>()
            .Property(e => e.imageName)
            .HasConversion(
            v => string.Join(',', v),
            v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

            //to map messages 
            /*modelBuilder.Entity<Message>().HasOne<User>(
            a => a.Sender).WithMany(
            d => d.messages).HasForeignKey(
            d => d.UserID);*/

            //chatroom has many messages (mapping)
            //modelBuilder.Entity<Message>()
            //.HasOne(m => m.ChatRoom)
            //.WithMany(cr => cr.Messages)
            //.HasForeignKey(m => m.ChatRoomId)
            //.OnDelete(DeleteBehavior.Cascade);
            //many-to-many like mapping for chatrooms and users

            //modelBuilder.Entity<ChatRoom>()
            //.HasOne(cr => cr.firstUser)
            //.WithMany(u => u.ChatRooms)
            //.HasForeignKey(cr => cr.firstUserId)
            //.OnDelete(DeleteBehavior.Cascade);

            /*modelBuilder.Entity<ChatRoom>()
            .HasOne(cr => cr.secondUser)
            .WithMany(u => u.ChatRooms)
            .HasForeignKey(cr => cr.secondUserId)
            .OnDelete(DeleteBehavior.Cascade); */

        }

    }
}