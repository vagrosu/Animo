using Animo.Application.Persistence;
using Animo.Domain.Common;
using Animo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class TextMessageRepository : BaseRepository<TextMessage>, ITextMessageRepository
{

    public TextMessageRepository(AnimoContext context) : base(context)
    {
    }

    public async Task<Result<IReadOnlyList<TextMessage>>> GetByChatRoomIdAsync(Guid chatRoomId)
    {
        var result = _context.Set<TextMessage>()
            .Where(textMessage => textMessage.ChatRoom.ChatRoomId == chatRoomId)
            .Include(message => message.Sender)
            .Include(message => message.MessageEmotion)
            .Include(message => message.UserPhotoEmotion)
            .ToListAsync();

        return Result<IReadOnlyList<TextMessage>>.Success(await result);
    }
}
