using Animo.Application.Persistance;
using Animo.Domain.Common;
using Animo.Domain.Entities;

namespace Animo.Application.Persistence;

public interface IChatRoomRepository : IAsyncRepository<ChatRoom>
{
    Task<Result<IReadOnlyList<ChatRoom>>> FindByUserIdAsync(Guid userId);
    Task<Result<ChatRoom>> FindByMemberIdsAsync(IReadOnlyList<Guid> memberIds);
    Task<Result<ChatRoom>> FindByMessageIdAsync(Guid messageId);
}
