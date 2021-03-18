using Barkeeper2.Models;
using HotChocolate.Types;

namespace Barkeeper2.GraphQL.Products {
    public class ProductType : ObjectType<Product> {
        protected override void Configure(IObjectTypeDescriptor<Product> descriptor) {
            descriptor.Description("Represents a product such as liquor, fruit, sugar, etc");
        }
    }
}