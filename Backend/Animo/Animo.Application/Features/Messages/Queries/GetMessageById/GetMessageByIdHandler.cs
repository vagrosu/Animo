using Animo.Application.Persistence;
using Animo.Domain.Common;
using MediatR;

namespace Animo.Application.Features.Messages.Queries.GetMessageById;

public class GetMessageByIdHandler(ITextMessageRepository textMessageRepository) : IRequestHandler<GetMessageByIdQuery, GetMessageByIdResponse>
{
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;

    public async Task<GetMessageByIdResponse> Handle(GetMessageByIdQuery request, CancellationToken cancellationToken)
    {
        var validationResult = await new GetMessageByIdValidator().ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return new GetMessageByIdResponse
            {
                Success = false,
                ValidationsErrors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.MessageId, out var textMessageId) == false)
        {
            return new GetMessageByIdResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { $"Invalid textMessageId {request.MessageId}" }
            };
        }

        var textMessage = await _textMessageRepository.FindByIdAsync(textMessageId);
        if (!textMessage.IsSuccess)
        {
            return new GetMessageByIdResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { textMessage.Error }
            };
        }

        var emotion = Emotion.Max(textMessage.Value.MessageEmotion + textMessage.Value.UserPhotoEmotion);

        return new GetMessageByIdResponse
        {
            Success = true,
            TextMessage = new ChatRoomMessageDto
            {
                TextMessageId = textMessage.Value.MessageId,
                Text = textMessage.Value.Text,
                SenderId = textMessage.Value.Sender.Id,
                Emotion = emotion.Key,
                SentTime = textMessage.Value.SentTime,
                RepliedMessageId = textMessage.Value.RepliedMessage?.MessageId,
                IsForwarded = textMessage.Value.IsForwarded
            }
        };
    }
}
