using System.Threading.Tasks;
using System.Collections.Generic;
using Barkeeper2.Models;
using HotChocolate;
using Barkeeper2.GraphQL.Products.DataLoaders;
using System.Threading;
using HotChocolate.Types;
using Barkeeper2.Interfaces;
using System.Linq;

namespace Barkeeper2.GraphQL.Products {
    [ExtendObjectType(Name = "Query")]
    public class ProductQueries {
        public Task<Product> GetProduct(
            int id,
            ProductByIdDataLoader dataLoader,
            CancellationToken cancellationToken) => dataLoader.LoadAsync(id, cancellationToken);

        public async Task<List<Product>> GetProducts([Service] IProductsRepository repo) {
            return (await repo.GetAllAsync()).ToList();
        }
    }
}