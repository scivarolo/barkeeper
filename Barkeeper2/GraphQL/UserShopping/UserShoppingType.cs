using HotChocolate.Types;

namespace Barkeeper2.GraphQL.UserShopping {
    public class UserShoppingType : ObjectType<Models.UserShopping> {
        protected override void Configure(IObjectTypeDescriptor<Models.UserShopping> descriptor) {
            descriptor.Description("Represents the products and/or ingredients a user has adding to their shopping list.");
        }
    }
}