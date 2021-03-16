using System.Threading.Tasks;
using System.Collections.Generic;
using Barkeeper2.Extensions;
using Barkeeper2.Models;
using Barkeeper2.GraphQL;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using Barkeeper2.GraphQL.DataLoaders;
using System.Threading;

namespace Barkeeper2.Data
{
    public class Query
    {
        public Task<Ingredient> GetIngredientAsync(
            int id,
            IngredientByIdDataLoader dataLoader,
            CancellationToken cancellationToken) => dataLoader.LoadAsync(id, cancellationToken);

        [UseGraphQLDbContext]
        public Task<List<Ingredient>> GetIngredients([ScopedService] GraphQLDbContext context)
        {
            return context.Ingredients.ToListAsync();
        }
    }
}
