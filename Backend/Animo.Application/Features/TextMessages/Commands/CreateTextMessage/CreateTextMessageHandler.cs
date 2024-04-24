using Animo.Application.Persistence;
using Animo.Domain.Common;
using Animo.Domain.Entities;
using MediatR;

namespace Animo.Application.Features.TextMessages.Commands.CreateTextMessage;

public class CreateTextMessageHandler(ITextMessageRepository textMessageRepository, IUserRepository userRepository, IChatRoomRepository chatRoomRepository) : IRequestHandler<CreateTextMessageCommand, CreateTextMessageCommandResponse>
{
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;

    public async Task<CreateTextMessageCommandResponse> Handle(CreateTextMessageCommand request, CancellationToken cancellationToken)
    {
        var validator = new CreateTextMessageCommandValidator();
        var validatorResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validatorResult.IsValid)
        {
            return new CreateTextMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.SenderId, out var senderGuid) == false)
        {
            return new CreateTextMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { $"Invalid user id {request.SenderId}." }
            };
        }
        var sender = await _userRepository.FindByIdAsync(senderGuid);
        if (!sender.IsSuccess)
        {
            return new CreateTextMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { sender.Error }
            };
        }

        if (Guid.TryParse(request.ChatRoomId, out var chatRoomGuid) == false)
        {
            return new CreateTextMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { $"Invalid chat room id {request.ChatRoomId}." }
            };
        }
        var chatRoom = await _chatRoomRepository.FindByIdAsync(chatRoomGuid);
        if (!chatRoom.IsSuccess)
        {
            return new CreateTextMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { chatRoom.Error }
            };
        }

        Result<TextMessage>? repliedMessage = null;
        if (!string.IsNullOrWhiteSpace(request.RepliedMessageId))
        {
            if (Guid.TryParse(request.RepliedMessageId, out var repliedMessageGuid) == false)
            {
                return new CreateTextMessageCommandResponse
                {
                    Success = false,
                    ValidationsErrors = new List<string> { $"Invalid replied message id {request.RepliedMessageId}." }
                };
            }

            repliedMessage = await _textMessageRepository.FindByIdAsync(repliedMessageGuid);
            if (!repliedMessage.IsSuccess)
            {
                return new CreateTextMessageCommandResponse
                {
                    Success = false,
                    ValidationsErrors = new List<string> { repliedMessage.Error }
                };
            }
        }

        //ToDo: replace mocked values
        var messageEmotion = MessageEmotion.Create(0, 0, 0, 0, 0, 0);
        var userPhotoEmotion = UserPhotoEmotion.Create(0, 0, 0, 0, 0, 0);

        var textMessage = TextMessage.Create(
            sender.Value,
            chatRoom.Value,
            request.Text,
            messageEmotion.Value,
            userPhotoEmotion.Value,
            repliedMessage?.Value ?? null,
            request.IsForwarded ?? null
        );
        if (!textMessage.IsSuccess)
        {
            return new CreateTextMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { textMessage.Error }
            };
        }

        var result = await _textMessageRepository.AddAsync(textMessage.Value);
        if (!result.IsSuccess)
        {
            return new CreateTextMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { result.Error }
            };
        }

        return new CreateTextMessageCommandResponse
        {
            Success = true,
            TextMessage = new CreateTextMessageDto
            {
                TextMessageId = result.Value.MessageId,
                Text = result.Value.Text,
                SentTime = result.Value.SentTime,
                IsForwarded = result.Value.IsForwarded,
            }
        };
    }
}
