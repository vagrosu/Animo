using Animo.Application.Persistance;
using Animo.Domain.Common;
using Animo.Domain.Entities;

namespace Animo.Application.Persistence;

public interface IChatRoomRepository : IAsyncRepository<ChatRoom>
{
    Task<Result<IReadOnlyList<ChatRoom>>> GetByUserIdAsync(Guid userId);
}
