using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Migrations
{
    public partial class updateproduct2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "products",
                newName: "createdDate");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("078269d8-1a12-4592-b92e-7ff1a876a5f2"),
                column: "ConcurrencyStamp",
                value: "51cf3528-cb13-4738-a6ed-3b14e087a7ec");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("6d9186ba-2cd6-4b6c-b729-4e605de1019f"),
                column: "ConcurrencyStamp",
                value: "942e1074-b38d-4f44-85d1-01960b21e03f");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("4557893f-1f56-4b6f-bb3b-caefd62c8c49"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "46fb7be6-3287-4f2e-b1cf-a845cd620495", "AQAAAAEAACcQAAAAEEfbP4/Me1r33NavPanZIDBLV5lO7Ktk4sPpU2uN0UM8r7IC7qpV8W3hI4Xa4OS0Wg==" });

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 1,
                column: "createdDate",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 2,
                column: "createdDate",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 3,
                column: "createdDate",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 4,
                column: "createdDate",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 5,
                column: "createdDate",
                value: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "createdDate",
                table: "products",
                newName: "CreatedDate");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("078269d8-1a12-4592-b92e-7ff1a876a5f2"),
                column: "ConcurrencyStamp",
                value: "0ef1ff86-679c-4bb9-a8de-1b08a376f890");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("6d9186ba-2cd6-4b6c-b729-4e605de1019f"),
                column: "ConcurrencyStamp",
                value: "9f840237-65a7-4370-a0ac-5d98205b2ef7");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("4557893f-1f56-4b6f-bb3b-caefd62c8c49"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "d9b9992b-474f-49a6-8ce6-e3624f4281a4", "AQAAAAEAACcQAAAAEFdohN63VY/ZmIeiu4q0oxvodTV7esWBrrN5sNn/inj6T48Dg4+hVn0jwfXSyy75Ag==" });

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2023, 5, 14, 19, 26, 38, 308, DateTimeKind.Local).AddTicks(50));

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2023, 5, 14, 19, 26, 38, 308, DateTimeKind.Local).AddTicks(9273));

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2023, 5, 14, 19, 26, 38, 308, DateTimeKind.Local).AddTicks(9362));

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2023, 5, 14, 19, 26, 38, 308, DateTimeKind.Local).AddTicks(9366));

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2023, 5, 14, 19, 26, 38, 308, DateTimeKind.Local).AddTicks(9368));
        }
    }
}
