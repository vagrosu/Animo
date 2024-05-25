using Animo.Application.Features.Users;
using MediatR;

namespace Animo.Application.Features.ChatRooms.Commands.CreateChatRoom;

public class CreateChatRoomCommand : IRequest<CreateChatRoomCommandResponse>
{
    public string? Name { get; set; }
    public List<string> MemberIds { get; set; }
}
