using Animo.Application.Persistance;
using Animo.Domain.Common;
using Animo.Domain.Entities;

namespace Animo.Application.Persistence;

public interface IMessageReactionRepository : IAsyncRepository<MessageReaction>
{
    public Task<Result<IReadOnlyList<MessageReaction>>> FindByMessageIdAsync(Guid messageId);
}
