using Barkeeper2.Models;
using HotChocolate.Types;

namespace Barkeeper2.GraphQL.Cocktails {
    public class CocktailType : ObjectType<Cocktail> {
        protected override void Configure(IObjectTypeDescriptor<Cocktail> descriptor) {
            descriptor.Description("Represents a cocktail recipe and its ingredients");
        }
    }
}