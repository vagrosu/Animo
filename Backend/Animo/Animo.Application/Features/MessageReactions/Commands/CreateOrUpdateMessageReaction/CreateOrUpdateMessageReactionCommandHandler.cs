using Animo.Application.Persistence;
using Animo.Domain.Common;
using Animo.Domain.Entities;
using MediatR;

namespace Animo.Application.Features.MessageReactions.Commands.CreateOrUpdateMessageReaction;

public class CreateOrUpdateMessageReactionCommandHandler(
    IUserRepository userRepository,
    ITextMessageRepository messageRepository,
    IMessageReactionRepository messageReactionRepository) : IRequestHandler<CreateOrUpdateMessageReactionCommand, CreateOrUpdateMessageReactionCommandResponse>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ITextMessageRepository _messageRepository = messageRepository;
    private readonly IMessageReactionRepository _messageReactionRepository = messageReactionRepository;

    public async Task<CreateOrUpdateMessageReactionCommandResponse> Handle(CreateOrUpdateMessageReactionCommand request, CancellationToken cancellationToken)
    {
        var validatorResult = await new CreateOrUpdateMessageReactionCommandValidator().ValidateAsync(request, cancellationToken);
        if (!validatorResult.IsValid)
        {
            return new CreateOrUpdateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.SenderId, out var senderGuid) == false)
        {
            return new CreateOrUpdateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { $"Invalid user id {request.SenderId}." }
            };
        }

        var sender = await _userRepository.FindByIdAsync(senderGuid);
        if (!sender.IsSuccess)
        {
            return new CreateOrUpdateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { $"User with id {request.SenderId} not found." }
            };
        }

        if(Guid.TryParse(request.MessageId, out var messageGuid) == false)
        {
            return new CreateOrUpdateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { $"Invalid message id {request.MessageId}." }
            };
        }

        var message = await _messageRepository.FindByIdAsync(messageGuid);
        if (!message.IsSuccess)
        {
            return new CreateOrUpdateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { $"Message with id {request.MessageId} not found." }
            };
        }

        var existingMessageReactions = await _messageReactionRepository.FindByMessageIdAsync(messageGuid);
        if (!existingMessageReactions.IsSuccess)
        {
            return new CreateOrUpdateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 500,
                ValidationsErrors = new List<string> { existingMessageReactions.Error }
            };
        }

        Result<MessageReaction>? messageReactionResult = null;
        var userHasReactionOnMessage = existingMessageReactions.Value.Select(reaction => reaction.User.Id).Contains(senderGuid);
        if (userHasReactionOnMessage)
        {
            var existingMessageReaction = message.Value.MessageReactions.First(reaction => reaction.User.Id == senderGuid);
            messageReactionResult = existingMessageReaction.Update(request.Emoji);
            if (!messageReactionResult.IsSuccess)
            {
                return new CreateOrUpdateMessageReactionCommandResponse
                {
                    Success = false,
                    StatusCode = 400,
                    ValidationsErrors = new List<string> { messageReactionResult.Error }
                };
            }

            var updateResult = await _messageReactionRepository.UpdateAsync(messageReactionResult.Value);
            if (!updateResult.IsSuccess)
            {
                return new CreateOrUpdateMessageReactionCommandResponse
                {
                    Success = false,
                    StatusCode = 500,
                    ValidationsErrors = new List<string> { updateResult.Error }
                };
            }

            return new CreateOrUpdateMessageReactionCommandResponse
            {
                Success = true,
                StatusCode = 200,
                MessageReaction = new CreateOrUpdateMessageReactionCommandDto
                {
                    MessageReactionId = updateResult.Value.MessageReactionId,
                    MessageId = updateResult.Value.TextMessage.MessageId,
                    SenderId = updateResult.Value.User.Id,
                    Emoji = updateResult.Value.Emoji
                }
            };
        }

        messageReactionResult = MessageReaction.Create(message.Value, sender.Value, request.Emoji);
        if (!messageReactionResult.IsSuccess)
        {
            return new CreateOrUpdateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { messageReactionResult.Error }
            };
        }

        var result = await _messageReactionRepository.AddAsync(messageReactionResult.Value);
        if (!result.IsSuccess)
        {
            return new CreateOrUpdateMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 500,
                ValidationsErrors = new List<string> { result.Error }
            };
        }

        return new CreateOrUpdateMessageReactionCommandResponse
        {
            Success = true,
            StatusCode = 201,
            MessageReaction = new CreateOrUpdateMessageReactionCommandDto
            {
                MessageReactionId = result.Value.MessageReactionId,
                MessageId = result.Value.TextMessage.MessageId,
                SenderId = result.Value.User.Id,
                Emoji = result.Value.Emoji
            }
        };
    }
}
