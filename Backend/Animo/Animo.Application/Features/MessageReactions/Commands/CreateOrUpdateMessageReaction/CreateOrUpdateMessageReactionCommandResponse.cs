using Animo.Domain.Responses;

namespace Animo.Application.Features.MessageReactions.Commands.CreateOrUpdateMessageReaction;

public class CreateOrUpdateMessageReactionCommandResponse : BaseResponse
{
    public CreateOrUpdateMessageReactionCommandResponse()
    {

    }

    public CreateOrUpdateMessageReactionCommandDto MessageReaction { get; set; }
}
