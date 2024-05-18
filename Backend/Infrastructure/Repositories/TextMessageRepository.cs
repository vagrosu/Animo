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

    public async Task<Result<TextMessage>> FindByIdAsync(Guid id)
    {
        var result = await _context.Set<TextMessage>()
            .Include(message => message.Sender)
            .Include(message => message.MessageEmotion)
            .Include(message => message.UserPhotoEmotion)
            .FirstOrDefaultAsync(message => message.MessageId == id);

        return result == null ? Result<TextMessage>.Failure($"Entity with id {id} not found") : Result<TextMessage>.Success(result);
    }

    public async Task<Result<IReadOnlyList<TextMessage>>> FindByChatRoomIdAsync(Guid chatRoomId)
    {
        var result = await _context.Set<TextMessage>()
            .Where(textMessage => textMessage.ChatRoom.ChatRoomId == chatRoomId)
            .Include(message => message.Sender)
            .Include(message => message.MessageEmotion)
            .Include(message => message.UserPhotoEmotion)
            .ToListAsync();

        return Result<IReadOnlyList<TextMessage>>.Success(result);
    }
}
