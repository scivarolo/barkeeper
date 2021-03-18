using Barkeeper2.Models;
using HotChocolate;
using HotChocolate.Types;
using System.Linq;
using HotChocolate.Data;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Barkeeper2.GraphQL.UserHistories {
    [ExtendObjectType(Name = "Query")]
    public class UserHistoryQueries {
        [UseDbContext(typeof(GraphQLDbContext))]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<UserHistory> GetUserHistories(
            [ScopedService] GraphQLDbContext dbContext,
            [Service] IHttpContextAccessor httpContext) {
                var userId = httpContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
                return dbContext.UserHistories.Where(uh => uh.UserId == userId);
            }
    }
}