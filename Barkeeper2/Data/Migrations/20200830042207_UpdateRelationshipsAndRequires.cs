using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Barkeeper2.Data.Migrations
{
    public partial class UpdateRelationshipsAndRequires : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateAdded",
                table: "UserTabCocktails",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateAdded",
                table: "UserShopping",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateAdded",
                table: "UserProducts",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateAdded",
                table: "UserCocktails",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Ingredients",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Cocktails",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Instructions",
                table: "Cocktails",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Amount",
                table: "CocktailIngredients",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsRequired",
                table: "CocktailIngredients",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "CocktailIngredients",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Units",
                table: "CocktailIngredients",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateAdded",
                table: "UserTabCocktails");

            migrationBuilder.DropColumn(
                name: "DateAdded",
                table: "UserShopping");

            migrationBuilder.DropColumn(
                name: "DateAdded",
                table: "UserProducts");

            migrationBuilder.DropColumn(
                name: "DateAdded",
                table: "UserCocktails");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "CocktailIngredients");

            migrationBuilder.DropColumn(
                name: "IsRequired",
                table: "CocktailIngredients");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "CocktailIngredients");

            migrationBuilder.DropColumn(
                name: "Units",
                table: "CocktailIngredients");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Ingredients",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Cocktails",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<string>(
                name: "Instructions",
                table: "Cocktails",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string));
        }
    }
}
