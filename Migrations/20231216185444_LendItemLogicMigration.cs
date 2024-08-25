using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace my_new_app.Migrations
{
    /// <inheritdoc />
    public partial class LendItemLogicMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOnLend",
                table: "LendItem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "BorrowedItemContainers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LendItemId = table.Column<int>(type: "int", nullable: false),
                    LenderId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BorrowedItemContainers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BorrowedItemContainers_LendItem_LendItemId",
                        column: x => x.LendItemId,
                        principalTable: "LendItem",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LentItemContainers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LendItemId = table.Column<int>(type: "int", nullable: false),
                    BorrowerId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LentItemContainers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LentItemContainers_LendItem_LendItemId",
                        column: x => x.LendItemId,
                        principalTable: "LendItem",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BorrowedItemContainers_LendItemId",
                table: "BorrowedItemContainers",
                column: "LendItemId");

            migrationBuilder.CreateIndex(
                name: "IX_BorrowedItemContainers_UserId",
                table: "BorrowedItemContainers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LentItemContainers_LendItemId",
                table: "LentItemContainers",
                column: "LendItemId");

            migrationBuilder.CreateIndex(
                name: "IX_LentItemContainers_UserId",
                table: "LentItemContainers",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BorrowedItemContainers");

            migrationBuilder.DropTable(
                name: "LentItemContainers");

            migrationBuilder.DropColumn(
                name: "IsOnLend",
                table: "LendItem");
        }
    }
}
