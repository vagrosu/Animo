namespace Animo.Application.Features.TextMessages.Commands.CreateTextMessage;

public class CreateTextMessageDto
{
    public Guid TextMessageId { get; set; }
    public string Text { get; set; }
    public DateTime SentTime { get; set; }
    public bool IsForwarded { get; set; }
}
