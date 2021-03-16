using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Barkeeper2.Extensions;
using Barkeeper2.Models;
using HotChocolate;
using Microsoft.EntityFrameworkCore;

namespace Barkeeper2.Data
{
    public class Query
    {
        [UseGraphQLDbContext]
        public async Task<Ingredient> GetIngredient([ScopedService] GraphQLDbContext context) => await context.Ingredients.FirstOrDefaultAsync();

        [UseGraphQLDbContext]
        public async Task<List<Ingredient>> GetIngredients([ScopedService] GraphQLDbContext context)
        {
            return await context.Ingredients.ToListAsync();
        }
    }
}
