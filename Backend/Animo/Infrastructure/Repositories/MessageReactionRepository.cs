using Animo.Application.Persistence;
using Animo.Domain.Entities;

namespace Infrastructure.Repositories;

public class MessageReactionRepository : BaseRepository<MessageReaction>, IMessageReactionRepository
{

    public MessageReactionRepository(AnimoContext context) : base(context)
    {
    }
}
