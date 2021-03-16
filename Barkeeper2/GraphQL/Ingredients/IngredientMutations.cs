using System.Threading.Tasks;
using Barkeeper2.Extensions;
using Barkeeper2.Models;
using HotChocolate;
using HotChocolate.Types;

namespace Barkeeper2.GraphQL.Ingredients {
    [ExtendObjectType(Name = "Mutation")]
    public class IngredientMutations {
        [UseGraphQLDbContext]
        public async Task<AddIngredientPayload> AddIngredientAsync(
            AddIngredientInput input,
            [ScopedService] GraphQLDbContext Context
        ) {
            var ingredient = new Ingredient {
                Name = input.Name,
                Liquid = input.Liquid,
            };

            Context.Ingredients.Add(ingredient);
            await Context.SaveChangesAsync();

            return new AddIngredientPayload(ingredient);
        }
    }
}
