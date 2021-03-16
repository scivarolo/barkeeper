using System.Collections.Generic;
using Barkeeper2.GraphQL.Common;
using Barkeeper2.Models;

namespace Barkeeper2.GraphQL.Ingredients {
    public class IngredientPayloadBase : Payload {
        protected IngredientPayloadBase(Ingredient ingredient) {
            Ingredient = ingredient;
        }

        protected IngredientPayloadBase(IReadOnlyList<UserError> errors) : base(errors) {}

        public Ingredient Ingredient { get; }
    }
}