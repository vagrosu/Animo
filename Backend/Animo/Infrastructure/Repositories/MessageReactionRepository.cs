using Animo.Application.Persistence;
using Animo.Domain.Common;
using Animo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class MessageReactionRepository : BaseRepository<MessageReaction>, IMessageReactionRepository
{

    public MessageReactionRepository(AnimoContext context) : base(context)
    {
    }

    public async Task<Result<IReadOnlyList<MessageReaction>>> FindByMessageIdAsync(Guid messageId)
    {
        var result = await _context.Set<MessageReaction>()
            .Where(reaction => reaction.TextMessage.MessageId == messageId)
            .Include(reaction => reaction.User)
            .ToListAsync();

        return Result<IReadOnlyList<MessageReaction>>.Success(result);
    }
}
