using Microsoft.EntityFrameworkCore.Migrations;

namespace Wiki.Data.Migrations
{
    public partial class RealmShards : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RealmShards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Code = table.Column<string>(type: "TEXT", nullable: false),
                    IsOrdered = table.Column<bool>(type: "INTEGER", nullable: false),
                    RealmId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RealmShards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RealmShards_Realms_RealmId",
                        column: x => x.RealmId,
                        principalTable: "Realms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RealmShardEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EntryOrder = table.Column<int>(type: "INTEGER", nullable: true),
                    RealmShardId = table.Column<int>(type: "INTEGER", nullable: false),
                    FragmentId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RealmShardEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RealmShardEntries_Fragments_FragmentId",
                        column: x => x.FragmentId,
                        principalTable: "Fragments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RealmShardEntries_RealmShards_RealmShardId",
                        column: x => x.RealmShardId,
                        principalTable: "RealmShards",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RealmShardEntries_FragmentId",
                table: "RealmShardEntries",
                column: "FragmentId");

            migrationBuilder.CreateIndex(
                name: "IX_RealmShardEntries_RealmShardId",
                table: "RealmShardEntries",
                column: "RealmShardId");

            migrationBuilder.CreateIndex(
                name: "IX_RealmShards_RealmId",
                table: "RealmShards",
                column: "RealmId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RealmShardEntries");

            migrationBuilder.DropTable(
                name: "RealmShards");
        }
    }
}
