using System;
using Barkeeper2.Models;

namespace Barkeeper2.Data.Mutations
{
    public record AddIngredientInput(
        string Name,
        bool Liquid
    );

    public class AddIngredientPayload
    {
        public AddIngredientPayload(Ingredient Ingredient)
        {
            this.Ingredient = Ingredient;
        }
        public Ingredient Ingredient { get; set; }
    }
}
