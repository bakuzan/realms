using Microsoft.EntityFrameworkCore.Migrations;

namespace Wiki.Data.Migrations
{
    public partial class Fragments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Realms_AspNetUsers_ApplicationUserId",
                table: "Realms");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "Realms",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "Fragments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Code = table.Column<string>(type: "TEXT", nullable: false),
                    Content = table.Column<string>(type: "TEXT", nullable: true),
                    RealmId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fragments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Fragments_Realms_RealmId",
                        column: x => x.RealmId,
                        principalTable: "Realms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FragmentTag",
                columns: table => new
                {
                    FragmentsId = table.Column<int>(type: "INTEGER", nullable: false),
                    TagsId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FragmentTag", x => new { x.FragmentsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_FragmentTag_Fragments_FragmentsId",
                        column: x => x.FragmentsId,
                        principalTable: "Fragments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FragmentTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Fragments_RealmId",
                table: "Fragments",
                column: "RealmId");

            migrationBuilder.CreateIndex(
                name: "IX_FragmentTag_TagsId",
                table: "FragmentTag",
                column: "TagsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Realms_AspNetUsers_ApplicationUserId",
                table: "Realms",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Realms_AspNetUsers_ApplicationUserId",
                table: "Realms");

            migrationBuilder.DropTable(
                name: "FragmentTag");

            migrationBuilder.DropTable(
                name: "Fragments");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationUserId",
                table: "Realms",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_Realms_AspNetUsers_ApplicationUserId",
                table: "Realms",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
