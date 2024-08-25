using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace my_new_app.Migrations
{
    /// <inheritdoc />
    public partial class UserIdItemType2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "itemType",
                table: "SalesItem",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "userId",
                table: "SalesItem",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "itemType",
                table: "SalesItem");

            migrationBuilder.DropColumn(
                name: "userId",
                table: "SalesItem");
        }
    }
}
