using System.Reflection;
using Barkeeper2.GraphQL;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;

namespace Barkeeper2.Extensions
{
    public class UseGraphQLDbContextAttribute : ObjectFieldDescriptorAttribute
    {
        public override void OnConfigure(IDescriptorContext context, IObjectFieldDescriptor descriptor, MemberInfo member)
        {
            descriptor.UseDbContext<GraphQLDbContext>();
        }
    }
}
