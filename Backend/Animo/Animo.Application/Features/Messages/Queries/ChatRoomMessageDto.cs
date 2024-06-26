using Animo.Application.Features.MessageReactions;

namespace Animo.Application.Features.Messages.Queries;

public class ChatRoomMessageDto
{
    public Guid TextMessageId { get; set; }
    public string Text { get; set; }
    public Guid SenderId { get; set; }
    public string Emotion { get; set; }
    public DateTime SentTime { get; set; }
    public IReadOnlyList<MessageReactionDto> Reactions { get; set; }
    public Guid? RepliedMessageId { get; set; }
    public bool? IsForwarded { get; set; }
}
