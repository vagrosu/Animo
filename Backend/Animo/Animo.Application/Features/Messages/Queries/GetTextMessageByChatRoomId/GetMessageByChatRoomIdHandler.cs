using Animo.Application.Persistence;
using Animo.Domain.Common;
using MediatR;

namespace Animo.Application.Features.Messages.Queries.GetTextMessageByChatRoomId;
//ToDo: Extend to support all types of messages
public class GetMessageByChatRoomIdHandler(ITextMessageRepository textMessageRepository, IChatRoomRepository chatRoomRepository) : IRequestHandler<GetMessageByChatRoomIdQuery, GetMessageByChatRoomIdResponse>
{
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;

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

        return new GetMessageByChatRoomIdResponse
        {
            Success = true,
            TextMessages = textMessages.Value.Select(textMessage =>
            {
                var emotion = Emotion.Max(textMessage.MessageEmotion + textMessage.UserPhotoEmotion);

                return new ChatRoomMessageDto
                {
                    TextMessageId = textMessage.MessageId,
                    Text = textMessage.Text,
                    SenderId = textMessage.Sender.Id,
                    Emotion = emotion.Key,
                    SentTime = textMessage.SentTime,
                    RepliedMessageId = textMessage.RepliedMessage?.MessageId,
                    IsForwarded = textMessage.IsForwarded
                };
            }).OrderBy(textMessage => textMessage.SentTime).ToList()
        };
    }
}
