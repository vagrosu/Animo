namespace Animo.Application.Features.MessageReactions.Commands.CreateMessageReaction;

public class CreateMessageReactionCommandDto
{
    public Guid MessageReactionId { get; set; }
    public Guid MessageId { get; set; }
    public Guid SenderId { get; set; }
    public string Emoji { get; set; }
}
