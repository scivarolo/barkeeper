using Barkeeper2.Models;
using HotChocolate.Types;

namespace Barkeeper2.GraphQL.UserProducts {
    public class UserProductType : ObjectType<UserProduct> {
        protected override void Configure(IObjectTypeDescriptor<UserProduct> descriptor) {
            descriptor.Description("Represents a product that a user has in their bar/inventory available for making a cocktail");
        }
    }
}