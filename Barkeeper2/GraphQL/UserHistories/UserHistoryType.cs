using Barkeeper2.Models;
using HotChocolate.Types;

namespace Barkeeper2.GraphQL.UserHistories {
    public class UserHistoryType : ObjectType<UserHistory> {
        protected override void Configure(IObjectTypeDescriptor<UserHistory> descriptor) {
            descriptor.Description("Represents a running history of each time a user makes a cocktail.");
        }
    }
}