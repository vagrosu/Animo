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

    public async override Task<Result<TextMessage>> FindByIdAsync(Guid id)
    {
        var result = await _context.Set<TextMessage>()
            .Include(message => message.Sender)
            .Include(message => message.MessageEmotion)
            .Include(message => message.UserPhotoEmotion)
            .Include(message => message.MessageReactions)
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
            .Include(message => message.MessageReactions)
            .ToListAsync();

        return Result<IReadOnlyList<TextMessage>>.Success(result);
    }

    public async Task<Result<TextMessage>> FindLastByChatRoomIdAsync(Guid chatRoomId)
    {
        var lastMessage = await _context.Set<TextMessage>()
            .Where(textMessage => textMessage.ChatRoom.ChatRoomId == chatRoomId)
            .OrderByDescending(message => message.SentTime)
            .Include(message => message.Sender)
            .Include(message => message.MessageEmotion)
            .Include(message => message.UserPhotoEmotion)
            .Include(message => message.MessageReactions)
            .FirstOrDefaultAsync();

        return lastMessage != null
            ? Result<TextMessage>.Success(lastMessage)
            : Result<TextMessage>.Failure("No messages found.");
    }

    public async Task<Result<TextMessage>> FindByMessageReactionIdAsync(Guid messageReactionId)
    {
        var message = await _context.Set<TextMessage>()
            .Include(textMessage => textMessage.MessageReactions)
            .Include(textMessage => textMessage.Sender)
            .FirstOrDefaultAsync(textMessage => textMessage.MessageReactions.Any(reaction => reaction.MessageReactionId == messageReactionId));

        return message != null
            ? Result<TextMessage>.Success(message)
            : Result<TextMessage>.Failure("No message found.");
    }


}
