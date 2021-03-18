using Barkeeper2.GraphQL.Ingredients.DataLoaders;
using Barkeeper2.Models;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Barkeeper2.GraphQL.Ingredients {
    [ExtendObjectType(Name = "Query")]
    public class IngredientQueries {

        public Task<Ingredient> GetIngredient(
            int id,
            IngredientByIdDataLoader dataLoader,
            CancellationToken cancellationToken) => dataLoader.LoadAsync(id, cancellationToken);

        [UseDbContext(typeof(GraphQLDbContext))]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Ingredient> GetIngredients([ScopedService] GraphQLDbContext dbContext) {
            return dbContext.Ingredients;
        }
    }
}
