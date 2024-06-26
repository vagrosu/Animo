using MediatR;

namespace Animo.Application.Features.MessageReactions.Commands.CreateMessageReaction;

public class CreateMessageReactionCommand : IRequest<CreateMessageReactionCommandResponse>
{
    public string MessageId { get; set; }
    public string SenderId { get; set; }
    public string Emoji { get; set; }
}
