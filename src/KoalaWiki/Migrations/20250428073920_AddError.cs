using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KoalaWiki.Migrations
{
    /// <inheritdoc />
    public partial class AddError : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Error",
                table: "Warehouses",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Error",
                table: "Warehouses");
        }
    }
}
