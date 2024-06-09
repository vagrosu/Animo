using MediatR;
using Microsoft.AspNetCore.Http;

namespace Animo.Application.Features.Messages.Commands.CreateMessage;

public class CreateMessageCommand : IRequest<CreateMessageCommandResponse>
{
    public string ChatRoomId { get; set; }
    public string SenderId { get; set; }
    public string Text { get; set; }
    public IFormFile? UserPhoto { get; set; }
    public string? RepliedMessageId { get; set; }
    public bool? IsForwarded { get; set; }
}
