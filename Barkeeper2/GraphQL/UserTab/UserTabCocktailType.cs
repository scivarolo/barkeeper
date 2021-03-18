using Barkeeper2.Models;
using HotChocolate.Types;

namespace Barkeeper2.GraphQL.UserTabs {
    public class UserTabCocktailType : ObjectType<UserTabCocktail> {
        protected override void Configure(IObjectTypeDescriptor<UserTabCocktail> descriptor) {
            descriptor.Description("Represents the cocktails a user has queued to make.");
        }
    }
}