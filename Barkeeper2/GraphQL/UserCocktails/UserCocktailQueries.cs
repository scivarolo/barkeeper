using Barkeeper2.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Linq;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Barkeeper2.GraphQL.UserCocktails {
    [ExtendObjectType(Name = "Query")]
    public class UserCocktailQueries {

        [UseDbContext(typeof(GraphQLDbContext))]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<UserCocktail> GetUserCocktails(
            [ScopedService] GraphQLDbContext dbContext,
            [Service] IHttpContextAccessor httpContext) {
                var userId = httpContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                return dbContext.UserCocktails.Where(uc => uc.UserId == userId);
            }
    }
}