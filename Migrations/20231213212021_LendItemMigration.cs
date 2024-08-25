using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace my_new_app.Migrations
{
    /// <inheritdoc />
    public partial class LendItemMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LendItem",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    listDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    owner = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    header = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    itemType = table.Column<int>(type: "int", nullable: true),
                    imageName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LendItem", x => x.ID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LendItem");
        }
    }
}
