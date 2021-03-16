using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Barkeeper2.Models;
using GreenDonut;
using HotChocolate.DataLoader;
using Microsoft.EntityFrameworkCore;
using Barkeeper2.GraphQL;

namespace Barkeeper2.GraphQL.DataLoaders
{
    public class IngredientByIdDataLoader : BatchDataLoader<int, Ingredient>
    {
        private readonly IDbContextFactory<GraphQLDbContext> _dbContextFactory;
        public IngredientByIdDataLoader(
            IBatchScheduler batchScheduler,
            IDbContextFactory<GraphQLDbContext> dbContextFactory
        ) : base(batchScheduler) {
            _dbContextFactory = dbContextFactory ?? throw new ArgumentNullException(nameof(dbContextFactory));
        }

        protected override async Task<IReadOnlyDictionary<int, Ingredient>> LoadBatchAsync(
            IReadOnlyList<int> keys,
            CancellationToken cancellationToken
        ) {
            await using GraphQLDbContext db = _dbContextFactory.CreateDbContext();
            return await db.Ingredients
                .Where(i => keys.Contains(i.Id))
                .ToDictionaryAsync(i => i.Id, cancellationToken);
        }
    }
}
