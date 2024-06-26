using Animo.Domain.Responses;

namespace Animo.Application.Features.MessageReactions.Commands.CreateMessageReaction;

public class CreateMessageReactionCommandResponse : BaseResponse
{
    public CreateMessageReactionCommandResponse()
    {

    }

    public CreateMessageReactionCommandDto MessageReaction { get; set; }
}
