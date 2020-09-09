using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Barkeeper2.Migrations
{
    public partial class GenerateIngredientTimestamp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Ingredients",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone",
                oldDefaultValueSql: "SELECT CURRENT_DATE");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedDate",
                table: "Ingredients",
                type: "timestamp without time zone",
                nullable: false,
                defaultValueSql: "SELECT CURRENT_DATE",
                oldClrType: typeof(DateTime),
                oldDefaultValueSql: "CURRENT_TIMESTAMP");
        }
    }
}
