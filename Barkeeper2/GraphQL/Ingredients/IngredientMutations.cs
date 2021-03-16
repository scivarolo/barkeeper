using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Barkeeper2.GraphQL.Extensions;
using Barkeeper2.Interfaces;
using Barkeeper2.Models;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;

namespace Barkeeper2.GraphQL.Ingredients {
    [ExtendObjectType(Name = "Mutation")]
    public class IngredientMutations {

        public async Task<AddIngredientPayload> AddIngredientAsync(
            AddIngredientInput input,
            [Service] IHttpContextAccessor httpContext,
            [Service] IIngredientsService ingredientsService
        ) {
            var user = httpContext.HttpContext.User;
            var userId = user.FindFirst(ClaimTypes.NameIdentifier).Value;

            var ingredient = new Ingredient {
                Name = input.Name,
                Liquid = input.Liquid,
                CreatedById = userId,
                CreatedDate = DateTime.UtcNow
            };

            var result = await ingredientsService.SaveNewIngredient(ingredient);
            return new AddIngredientPayload(result);
        }
    }
}
