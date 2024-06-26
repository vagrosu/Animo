namespace Animo.Application.Features.Messages.Queries;

public class MessageReactionDto
{
    public Guid SenderId { get; set; }
    public string Emoji { get; set; }
}
