using Animo.Application.Features.Message.Commands.CreateMessage.GetMessageEmotion;
using Animo.Application.Persistence;
using Animo.Domain.Common;
using Animo.Domain.Entities;
using MediatR;

namespace Animo.Application.Features.Message.Commands.CreateMessage;
//ToDo: Extend to support all types of messages
public class CreateMessageHandler(ITextMessageRepository textMessageRepository, IUserRepository userRepository, IChatRoomRepository chatRoomRepository, IMessageEmotionRepository messageEmotionRepository) : IRequestHandler<CreateMessageCommand, CreateMessageCommandResponse>
{
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;
    private readonly IMessageEmotionRepository _messageEmotionRepository = messageEmotionRepository;

    public async Task<CreateMessageCommandResponse> Handle(CreateMessageCommand request, CancellationToken cancellationToken)
    {
        var warnings = new List<string>();

        var validator = new CreateMessageCommandValidator();
        var validatorResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validatorResult.IsValid)
        {
            return new CreateMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.SenderId, out var senderGuid) == false)
        {
            return new CreateMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { $"Invalid user id {request.SenderId}." }
            };
        }
        var sender = await _userRepository.FindByIdAsync(senderGuid);
        if (!sender.IsSuccess)
        {
            return new CreateMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { sender.Error }
            };
        }

        if (Guid.TryParse(request.ChatRoomId, out var chatRoomGuid) == false)
        {
            return new CreateMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { $"Invalid chat room id {request.ChatRoomId}." }
            };
        }
        var chatRoom = await _chatRoomRepository.FindByIdAsync(chatRoomGuid);
        if (!chatRoom.IsSuccess)
        {
            return new CreateMessageCommandResponse
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
                return new CreateMessageCommandResponse
                {
                    Success = false,
                    ValidationsErrors = new List<string> { $"Invalid replied message id {request.RepliedMessageId}." }
                };
            }

            repliedMessage = await _textMessageRepository.FindByIdAsync(repliedMessageGuid);
            if (!repliedMessage.IsSuccess)
            {
                return new CreateMessageCommandResponse
                {
                    Success = false,
                    ValidationsErrors = new List<string> { repliedMessage.Error }
                };
            }
        }

        var messageEmotion = await HandleEmotionProcessing(request.Text);
        if (!messageEmotion.IsSuccess)
        {
            messageEmotion = MessageEmotion.Create(0, 0, 0, 0, 0, 0);
            warnings.Add(messageEmotion.Error);
        }
        else
        {
            var messageEmotionResult = await _messageEmotionRepository.AddAsync(messageEmotion.Value);
            if (!messageEmotionResult.IsSuccess)
            {
                warnings.Add(messageEmotionResult.Error);
            }
        }

        //ToDo: replace mocked values
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
            return new CreateMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { textMessage.Error }
            };
        }

        var result = await _textMessageRepository.AddAsync(textMessage.Value);
        if (!result.IsSuccess)
        {
            return new CreateMessageCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { result.Error }
            };
        }

        return new CreateMessageCommandResponse
        {
            Success = true,
            TextMessage = new CreateMessageDto
            {
                TextMessageId = result.Value.MessageId,
                Text = result.Value.Text,
                SentTime = result.Value.SentTime,
                IsForwarded = result.Value.IsForwarded,
            },
            ValidationsErrors = warnings.Count > 0 ? warnings : null
        };
    }

    private async static Task<Result<MessageEmotion>> HandleEmotionProcessing(string text)
    {
        var messageEmotionResponse = await MessageEmotionClient.GetMessageEmotionAsync(text);
        var joy = Math.Clamp(messageEmotionResponse?.EmotionScores?.GetValueOrDefault("joy", 0) ?? 0, 0.0f, 1.0f);
        var surprise = Math.Clamp(messageEmotionResponse?.EmotionScores?.GetValueOrDefault("surprise", 0) ?? 0, 0.0f, 1.0f);
        var sadness = Math.Clamp(messageEmotionResponse?.EmotionScores?.GetValueOrDefault("sadness", 0) ?? 0, 0.0f, 1.0f);
        var disgust = Math.Clamp(messageEmotionResponse?.EmotionScores?.GetValueOrDefault("disgust", 0) ?? 0, 0.0f, 1.0f);
        var anger = Math.Clamp(messageEmotionResponse?.EmotionScores?.GetValueOrDefault("anger", 0) ?? 0, 0.0f, 1.0f);
        var fear = Math.Clamp(messageEmotionResponse?.EmotionScores?.GetValueOrDefault("fear", 0) ?? 0, 0.0f, 1.0f);

        return MessageEmotion.Create(joy, surprise, sadness, disgust, anger, fear);
    }

}
