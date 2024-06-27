using Animo.Application.Persistance;
using Animo.Domain.Common;
using Animo.Domain.Entities;

namespace Animo.Application.Persistence;

public interface ITextMessageRepository : IAsyncRepository<TextMessage>
{
    public Task<Result<IReadOnlyList<TextMessage>>> FindByChatRoomIdAsync(Guid chatRoomId);
    public Task<Result<TextMessage>> FindLastByChatRoomIdAsync(Guid chatRoomId);
    public Task<Result<TextMessage>> FindByMessageReactionIdAsync(Guid messageReactionId);
}
