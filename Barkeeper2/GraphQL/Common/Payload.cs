using System.Collections.Generic;

namespace Barkeeper2.GraphQL.Common {
    public abstract class Payload {
        protected Payload(IReadOnlyList<UserError> errors = null) {
            Errors = errors;
        }

        public IReadOnlyList<UserError> Errors { get; }
    }
}