using System;
using System.Threading.Tasks;
using Barkeeper2.Data.Mutations;
using Barkeeper2.Extensions;
using Barkeeper2.Models;
using HotChocolate;

namespace Barkeeper2.Data
{
    public class Mutation
    {
        [UseGraphQLDbContext]
        public async Task<AddIngredientPayload> AddIngredientAsync(
            AddIngredientInput input,
            [ScopedService] GraphQLDbContext Context)
        {
            var ingredient = new Ingredient
            {
                Name = input.Name,
                Liquid = input.Liquid,

            };

            Context.Ingredients.Add(ingredient);
            await Context.SaveChangesAsync();

            return new AddIngredientPayload(ingredient);
        }
    }
}
