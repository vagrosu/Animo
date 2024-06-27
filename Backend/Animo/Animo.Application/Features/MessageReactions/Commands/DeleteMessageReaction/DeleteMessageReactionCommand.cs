using MediatR;

namespace Animo.Application.Features.MessageReactions.Commands.DeleteMessageReaction;

public class DeleteMessageReactionCommand : IRequest<DeleteMessageReactionCommandResponse>
{
    public string MessageReactionId { get; set; }
}
