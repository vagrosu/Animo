using MediatR;

namespace Animo.Application.Features.TextMessages.Commands.CreateTextMessage;

public class CreateTextMessageCommand : IRequest<CreateTextMessageCommandResponse>
{
    public string ChatRoomId { get; set; }
    public string SenderId { get; set; }
    public string Text { get; set; }
    public string? RepliedMessageId { get; set; }
    public bool? IsForwarded { get; set; }
}
