using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace my_new_app.Migrations
{
    /// <inheritdoc />
    public partial class TitleMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "SalesItem",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "LostItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "LendItem",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "FoundItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "DonationItem",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "title",
                table: "SalesItem");

            migrationBuilder.DropColumn(
                name: "title",
                table: "LostItems");

            migrationBuilder.DropColumn(
                name: "title",
                table: "LendItem");

            migrationBuilder.DropColumn(
                name: "title",
                table: "FoundItems");

            migrationBuilder.DropColumn(
                name: "title",
                table: "DonationItem");
        }
    }
}
