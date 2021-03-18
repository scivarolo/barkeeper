using HotChocolate;
using HotChocolate.Types;
using System.Linq;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Barkeeper2.GraphQL.UserShopping {
    [ExtendObjectType(Name = "Query")]
    public class UserShoppingQueries {
        [UseDbContext(typeof(GraphQLDbContext))]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<Models.UserShopping> GetUserShoppings(
            [ScopedService] GraphQLDbContext dbContext,
            [Service] IHttpContextAccessor httpContext) {
                var userId = httpContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                return dbContext.UserShopping.Where(up => up.UserId == userId);
            }
    }
}