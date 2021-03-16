using Barkeeper2.Models;
using GreenDonut;
using HotChocolate.DataLoader;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using System.Collections.Generic;
using System;
using Barkeeper2.Interfaces;

namespace Barkeeper2.GraphQL.Products.DataLoaders {
    public class ProductByIdDataLoader : BatchDataLoader<int, Product> {
        // private readonly IDbContextFactory<GraphQLDbContext> _dbContextFactory;
        private readonly IProductsRepository _productsRepo;
        public ProductByIdDataLoader(
            IBatchScheduler batchScheduler,
            IProductsRepository productsRepo
        ) : base(batchScheduler) {
            _productsRepo = productsRepo ?? throw new ArgumentNullException(nameof(productsRepo));
        }

        protected override async Task<IReadOnlyDictionary<int, Product>> LoadBatchAsync(
            IReadOnlyList<int> keys,
            CancellationToken cancellationToken
        ) {
            var products = await _productsRepo.FindAllAsync(p => keys.Contains(p.Id));
            return products.ToDictionary(p => p.Id);
        }
    }
}