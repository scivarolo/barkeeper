using Barkeeper2.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Linq;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Barkeeper2.GraphQL.UserProducts {
    [ExtendObjectType(Name = "Query")]
    public class UserProductQueries {
        [UseDbContext(typeof(GraphQLDbContext))]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<UserProduct> GetUserProducts(
            [ScopedService] GraphQLDbContext dbContext,
            [Service] IHttpContextAccessor httpContext) {
                var userId = httpContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                return dbContext.UserProducts.Where(up => up.UserId == userId);
            }
    }
}