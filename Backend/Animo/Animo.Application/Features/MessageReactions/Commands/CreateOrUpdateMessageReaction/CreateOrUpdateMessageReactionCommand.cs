using MediatR;

namespace Animo.Application.Features.MessageReactions.Commands.CreateOrUpdateMessageReaction;

public class CreateOrUpdateMessageReactionCommand : IRequest<CreateOrUpdateMessageReactionCommandResponse>
{
    public string MessageId { get; set; }
    public string SenderId { get; set; }
    public string Emoji { get; set; }
}
