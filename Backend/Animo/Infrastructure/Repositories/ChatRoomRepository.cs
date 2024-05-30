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

    public async Task<Result<IReadOnlyList<ChatRoom>>> FindByUserIdAsync(Guid userId)
    {
        var result = await _context.Set<ChatRoom>()
            .Where(chatRoom => chatRoom.ChatRoomMembers.Any(chatRoomMember => chatRoomMember.UserId == userId))
            .Include(chatRoom => chatRoom.ChatRoomMembers)
            .ToListAsync();
        return Result<IReadOnlyList<ChatRoom>>.Success(result);
    }

    public async Task<Result<ChatRoom>> FindByMemberIds(IReadOnlyList<Guid> memberIds)
    {
        var chatRooms = await _context.Set<ChatRoom>()
            .Where(chatRoom => chatRoom.ChatRoomMembers.Count == memberIds.Count)
            .Include(chatRoom => chatRoom.ChatRoomMembers)
            .ToListAsync();

        var chatRoom = chatRooms.FirstOrDefault(chatRoom =>
            chatRoom.ChatRoomMembers.Select(chatRoomMember => chatRoomMember.UserId).OrderBy(id => id)
                .SequenceEqual(memberIds.OrderBy(id => id)));

        return chatRoom == null
            ? Result<ChatRoom>.Failure("Chat room not found.")
            : Result<ChatRoom>.Success(chatRoom);
    }
}