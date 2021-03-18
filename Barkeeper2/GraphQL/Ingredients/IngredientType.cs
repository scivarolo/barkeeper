using System;
using System.Linq;
using Barkeeper2.Models;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;

namespace Barkeeper2.GraphQL.Ingredients {
    public class IngredientType : ObjectType<Ingredient> {
        protected override void Configure(IObjectTypeDescriptor<Ingredient> descriptor)
        {
            descriptor.Description("A basic ingredient to be used for cocktail making.");
            // descriptor.Field(i => i.Id).IsProjected(true);
            // descriptor
            //     .Field(i => i.Products)
            //     .ResolveWith<Resolvers>(r => r.GetProducts(default!, default!))
            //     .UseDbContext<GraphQLDbContext>()
            //     .Description("List of products that represent this ingredient.");
        }

        // private class Resolvers {
        //     public IQueryable<Product> GetProducts(Ingredient ingredient, [ScopedService] GraphQLDbContext dbContext) {
        //         var query = dbContext.Products.Where(p => p.IngredientId == ingredient.Id);
        //         return query;
        //     }
        // }
    }
}