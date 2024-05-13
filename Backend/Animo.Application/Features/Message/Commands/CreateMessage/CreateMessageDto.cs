namespace Animo.Application.Features.Message.Commands.CreateMessage;

public class CreateMessageDto
{
    public Guid TextMessageId { get; set; }
    public string Text { get; set; }
    public DateTime SentTime { get; set; }
    public bool IsForwarded { get; set; }
}
