using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace my_new_app.Migrations
{
    /// <inheritdoc />
    public partial class LendItemTimeMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LentDate",
                table: "LentItemContainers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "BorrowDate",
                table: "BorrowedItemContainers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LentDate",
                table: "LentItemContainers");

            migrationBuilder.DropColumn(
                name: "BorrowDate",
                table: "BorrowedItemContainers");
        }
    }
}
