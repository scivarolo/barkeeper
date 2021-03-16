using System.Threading.Tasks;
using System.Collections.Generic;
using Barkeeper2.GraphQL.Extensions;
using Barkeeper2.Models;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using Barkeeper2.GraphQL.Ingredients.DataLoaders;
using System.Threading;
using HotChocolate.Types;
using Barkeeper2.Interfaces;
using System.Linq;

namespace Barkeeper2.GraphQL.Ingredients
{
    [ExtendObjectType(Name = "Query")]
    public class IngredientQueries
    {
        public Task<Ingredient> GetIngredient(
            int id,
            IngredientByIdDataLoader dataLoader,
            CancellationToken cancellationToken) => dataLoader.LoadAsync(id, cancellationToken);

        // [UseGraphQLDbContext]
        // public Task<List<Ingredient>> GetIngredients([ScopedService] GraphQLDbContext context)
        // {
        //     return context.Ingredients.ToListAsync();
        // }

        public async Task<List<Ingredient>> GetIngredients([Service] IIngredientsRepository repo) {
            return (await repo.GetAllAsync()).ToList();
        }
    }
}
