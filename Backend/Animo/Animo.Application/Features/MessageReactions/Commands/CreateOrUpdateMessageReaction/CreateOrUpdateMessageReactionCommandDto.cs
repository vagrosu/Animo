namespace Animo.Application.Features.MessageReactions.Commands.CreateOrUpdateMessageReaction;

public class CreateOrUpdateMessageReactionCommandDto
{
    public Guid MessageReactionId { get; set; }
    public Guid MessageId { get; set; }
    public Guid SenderId { get; set; }
    public string Emoji { get; set; }
}
