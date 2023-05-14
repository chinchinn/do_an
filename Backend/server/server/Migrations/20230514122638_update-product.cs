using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace server.Migrations
{
    public partial class updateproduct : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "products",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "products");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("078269d8-1a12-4592-b92e-7ff1a876a5f2"),
                column: "ConcurrencyStamp",
                value: "d55d648e-fb8d-4df9-8153-02347bd37fff");

            migrationBuilder.UpdateData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: new Guid("6d9186ba-2cd6-4b6c-b729-4e605de1019f"),
                column: "ConcurrencyStamp",
                value: "c02a80d4-8ba0-4b53-b2a8-75e41f8931c0");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("4557893f-1f56-4b6f-bb3b-caefd62c8c49"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash" },
                values: new object[] { "ba96318b-6f55-48d1-8a6e-152ed1241f28", "AQAAAAEAACcQAAAAEPHHYoVk67qJK2XlL89dqBblV/9diAy3udgMksq2ZCEC5HvNykHlSJGzSUYv3wWEEA==" });
        }
    }
}
