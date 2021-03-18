using HotChocolate;
using HotChocolate.Types;
using System.Linq;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Barkeeper2.Models;

namespace Barkeeper2.GraphQL.UserTabs {
    [ExtendObjectType(Name = "Query")]
    public class UserTabQueries {
        [UseDbContext(typeof(GraphQLDbContext))]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<UserTabCocktail> GetUserTabCocktails(
            [ScopedService] GraphQLDbContext dbContext,
            [Service] IHttpContextAccessor httpContext) {
                var userId = httpContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                return dbContext.UserTabCocktails.Where(utc => utc.UserId == userId);
            }
    }
}