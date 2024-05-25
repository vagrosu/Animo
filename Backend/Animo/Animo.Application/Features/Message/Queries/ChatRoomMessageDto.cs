namespace Animo.Application.Features.Message.Queries;

public class ChatRoomMessageDto
{
    public Guid TextMessageId { get; set; }
    public string Text { get; set; }
    public Guid SenderId { get; set; }
    public string Emotion { get; set; }
    public DateTime SentTime { get; set; }
    public Guid? RepliedMessageId { get; set; }
    public bool? IsForwarded { get; set; }
}
