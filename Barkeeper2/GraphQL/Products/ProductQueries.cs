using System.Threading.Tasks;
using System.Collections.Generic;
using Barkeeper2.Models;
using HotChocolate;
using Barkeeper2.GraphQL.Products.DataLoaders;
using System.Threading;
using HotChocolate.Types;
using Barkeeper2.Interfaces;
using System.Linq;
using HotChocolate.Data;

namespace Barkeeper2.GraphQL.Products {
    [ExtendObjectType(Name = "Query")]
    public class ProductQueries {

        [UseProjection]
        public Task<Product> GetProduct(
            int id,
            ProductByIdDataLoader dataLoader,
            CancellationToken cancellationToken) => dataLoader.LoadAsync(id, cancellationToken);

        [UseDbContext(typeof(GraphQLDbContext))]
        [UseProjection]
        public IQueryable<Product> GetProducts([ScopedService] GraphQLDbContext dbContext) {
            return dbContext.Products;
        }
    }
}