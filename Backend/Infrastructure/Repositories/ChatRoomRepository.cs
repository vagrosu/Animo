using Animo.Application.Persistence;
using Animo.Domain.Common;
using Animo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ChatRoomRepository : BaseRepository<ChatRoom>, IChatRoomRepository
{

    public ChatRoomRepository(AnimoContext context) : base(context)
    {
    }

    public async Task<Result<IReadOnlyList<ChatRoom>>> GetByUserIdAsync(Guid userId)
    {
        var result = await _context.Set<ChatRoom>()
            .Where(chatRoom => chatRoom.ChatRoomMembers.Any(chatRoomMember => chatRoomMember.UserId == userId))
            .Include(chatRoom => chatRoom.ChatRoomMembers)
            .ToListAsync();
        return Result<IReadOnlyList<ChatRoom>>.Success(result);
    }
}
