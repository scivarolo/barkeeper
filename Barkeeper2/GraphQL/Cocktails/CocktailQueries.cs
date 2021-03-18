using System.Linq;
using Barkeeper2.GraphQL.Extensions;
using Barkeeper2.Models;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;

namespace Barkeeper2.GraphQL.Cocktails {

    [ExtendObjectType(Name = "Query")]
    public class CocktailQueries {
        [UseDbContext(typeof(GraphQLDbContext))]
        [UseProjection]
        public IQueryable<Cocktail> GetCocktails([ScopedService] GraphQLDbContext dbContext) {
            return dbContext.Cocktails;
        }
    }
}