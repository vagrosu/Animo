using Animo.Application.Persistance;
using Animo.Domain.Entities;

namespace Animo.Application.Persistence;

public interface IMessageReactionRepository : IAsyncRepository<MessageReaction>
{

}
