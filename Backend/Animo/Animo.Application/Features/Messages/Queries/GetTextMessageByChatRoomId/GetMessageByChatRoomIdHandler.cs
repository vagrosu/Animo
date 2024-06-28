using Animo.Application.Persistence;
using Animo.Domain.Common;
using MediatR;

namespace Animo.Application.Features.Messages.Queries.GetTextMessageByChatRoomId;

public class GetMessageByChatRoomIdHandler(
    ITextMessageRepository textMessageRepository,
    IChatRoomRepository chatRoomRepository,
    IMessageReactionRepository messageReactionRepository
    ) : IRequestHandler<GetMessageByChatRoomIdQuery, GetMessageByChatRoomIdResponse>
{
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;
    private readonly IMessageReactionRepository _messageReactionRepository = messageReactionRepository;

    public async Task<GetMessageByChatRoomIdResponse> Handle(GetMessageByChatRoomIdQuery request, CancellationToken cancellationToken)
    {
        var validationResult = await new GetMessageByChatRoomIdValidator().ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return new GetMessageByChatRoomIdResponse
            {
                Success = false,
                ValidationsErrors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.ChatRoomId, out var chatRoomId) == false)
        {
            return new GetMessageByChatRoomIdResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { $"Invalid chatRoomId {request.ChatRoomId}" }
            };
        }
        var chatRoom = await _chatRoomRepository.FindByIdAsync(chatRoomId);
        if (!chatRoom.IsSuccess)
        {
            return new GetMessageByChatRoomIdResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { chatRoom.Error }
            };
        }

        var textMessages = await _textMessageRepository.FindByChatRoomIdAsync(chatRoomId);
        if (!textMessages.IsSuccess)
        {
            return new GetMessageByChatRoomIdResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { textMessages.Error }
            };
        }

        var messageDtos = new List<ChatRoomMessageDto>();
        foreach (var textMessage in textMessages.Value)
        {
            var emotion = Emotion.Max(textMessage.MessageEmotion + textMessage.UserPhotoEmotion);
            var reactionsResult = await _messageReactionRepository.FindByMessageIdAsync(textMessage.MessageId);
            var reactionDtos = reactionsResult.Value.Select(reaction => new MessageReactionDto
            {
                MessageReactionId = reaction.MessageReactionId,
                SenderId = reaction.User.Id,
                Emoji = reaction.Emoji
            }).ToList();

            messageDtos.Add(new ChatRoomMessageDto
            {
                TextMessageId = textMessage.MessageId,
                Text = textMessage.Text,
                SenderId = textMessage.Sender.Id,
                Emotion = emotion.Value != 0 ? emotion.Key : "Unknown",
                SentTime = textMessage.SentTime,
                Reactions = reactionDtos,
                RepliedMessageId = textMessage.RepliedMessage?.MessageId,
                IsForwarded = textMessage.IsForwarded
            });
        }

        return new GetMessageByChatRoomIdResponse
        {
            Success = true,
            TextMessages = messageDtos.OrderBy(m => m.SentTime).ToList()
        };
    }
}
