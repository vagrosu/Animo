using Animo.Application.Persistence;
using Animo.Domain.Entities;
using MediatR;

namespace Animo.Application.Features.MessageReactions.Commands.CreateMessageReaction;

public class CreateMessageReactionCommandHandler(
    IUserRepository userRepository,
    ITextMessageRepository messageRepository,
    IMessageReactionRepository messageReactionRepository) : IRequestHandler<CreateMessageReactionCommand, CreateMessageReactionCommandResponse>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ITextMessageRepository _messageRepository = messageRepository;
    private readonly IMessageReactionRepository _messageReactionRepository = messageReactionRepository;

    public async Task<CreateMessageReactionCommandResponse> Handle(CreateMessageReactionCommand request, CancellationToken cancellationToken)
    {
        var validatorResult = await new CreateMessageReactionCommandValidator().ValidateAsync(request, cancellationToken);
        if (!validatorResult.IsValid)
        {
            return new CreateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.SenderId, out var senderGuid) == false)
        {
            return new CreateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { $"Invalid user id {request.SenderId}." }
            };
        }

        var sender = await _userRepository.FindByIdAsync(senderGuid);
        if (!sender.IsSuccess)
        {
            return new CreateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { $"User with id {request.SenderId} not found." }
            };
        }

        if(Guid.TryParse(request.MessageId, out var messageGuid) == false)
        {
            return new CreateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { $"Invalid message id {request.MessageId}." }
            };
        }

        var message = await _messageRepository.FindByIdAsync(messageGuid);
        if (!message.IsSuccess)
        {
            return new CreateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { $"Message with id {request.MessageId} not found." }
            };
        }

        var messageReaction = MessageReaction.Create(message.Value, sender.Value, request.Emoji);
        if (!messageReaction.IsSuccess)
        {
            return new CreateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { messageReaction.Error }
            };
        }

        var result = await _messageReactionRepository.AddAsync(messageReaction.Value);
        if (!result.IsSuccess)
        {
            return new CreateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 500,
                ValidationsErrors = new List<string> { result.Error }
            };
        }

        return new CreateMessageReactionCommandResponse
        {
            Success = true,
            StatusCode = 201,
            MessageReaction = new CreateMessageReactionCommandDto
            {
                MessageReactionId = result.Value.MessageReactionId,
                MessageId = result.Value.TextMessage.MessageId,
                SenderId = result.Value.User.Id,
                Emoji = result.Value.Emoji
            }
        };
    }
}
