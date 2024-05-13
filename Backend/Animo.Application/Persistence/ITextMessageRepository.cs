using Animo.Application.Persistance;
using Animo.Domain.Common;
using Animo.Domain.Entities;

namespace Animo.Application.Persistence;

public interface ITextMessageRepository : IAsyncRepository<TextMessage>
{
    public Task<Result<IReadOnlyList<TextMessage>>> GetByChatRoomIdAsync(Guid chatRoomId);
}
