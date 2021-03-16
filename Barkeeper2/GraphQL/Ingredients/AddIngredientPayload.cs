using System.Collections.Generic;
using Barkeeper2.Models;
using Barkeeper2.GraphQL.Common;

namespace Barkeeper2.GraphQL.Ingredients {
    public class AddIngredientPayload : IngredientPayloadBase {
        public AddIngredientPayload(Ingredient ingredient) : base(ingredient) {}

        public AddIngredientPayload(IReadOnlyList<UserError> errors) : base(errors) {}
    }
}