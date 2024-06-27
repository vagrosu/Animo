using Animo.Application.Persistence;
using MediatR;

namespace Animo.Application.Features.MessageReactions.Commands.DeleteMessageReaction;

public class DeleteMessageReactionCommandHandler(IMessageReactionRepository messageReactionRepository) : IRequestHandler<DeleteMessageReactionCommand, DeleteMessageReactionCommandResponse>
{
    private readonly IMessageReactionRepository _messageReactionRepository = messageReactionRepository;

    public async Task<DeleteMessageReactionCommandResponse> Handle(DeleteMessageReactionCommand request, CancellationToken cancellationToken)
    {
        var validatorResult = await new DeleteMessageReactionCommandValidator().ValidateAsync(request, cancellationToken);
        if (!validatorResult.IsValid)
        {
            return new DeleteMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.MessageReactionId, out var messageReactionGuid) == false)
        {
            return new DeleteMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { $"Invalid user id {request.MessageReactionId}." }
            };
        }

        var messageReaction = await _messageReactionRepository.FindByIdAsync(messageReactionGuid);
        if (!messageReaction.IsSuccess)
        {
            return new DeleteMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { $"MessageReaction with id {request.MessageReactionId} not found." }
            };
        }

        var deleteResult = await _messageReactionRepository.DeleteAsync(messageReactionGuid);
        if (!deleteResult.IsSuccess)
        {
            return new DeleteMessageReactionCommandResponse
            {
                Success = false,
                StatusCode = 500,
                ValidationsErrors = new List<string> { deleteResult.Error }
            };
        }

        return new DeleteMessageReactionCommandResponse
        {
            Success = true,
            StatusCode = 200
        };
    }
}
