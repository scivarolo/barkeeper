using Barkeeper2.Models;
using HotChocolate.Types;

namespace Barkeeper2.GraphQL.UserCocktails {
    public class UserCocktailType : ObjectType<UserCocktail> {
        protected override void Configure(IObjectTypeDescriptor<UserCocktail> descriptor) {
            descriptor.Description("Represents a cocktail that a user has saved to their library of cocktails");
        }
    }
}