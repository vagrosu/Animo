using MediatR;

namespace Animo.Application.Features.Message.Commands.CreateMessage;

public class CreateMessageCommand : IRequest<CreateMessageCommandResponse>
{
    public string ChatRoomId { get; set; }
    public string SenderId { get; set; }
    public string Text { get; set; }
    public string? RepliedMessageId { get; set; }
    public bool? IsForwarded { get; set; }
}
