namespace Animo.Application.Features.Messages.Queries;

public class MessageReactionDto
{
    public Guid MessageReactionId { get; set; }
    public Guid SenderId { get; set; }
    public string Emoji { get; set; }
}
