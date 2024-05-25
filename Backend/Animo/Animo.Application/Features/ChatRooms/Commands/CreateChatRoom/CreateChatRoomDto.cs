using Animo.Application.Features.Users;

namespace Animo.Application.Features.ChatRooms.Commands.CreateChatRoom;

public class CreateChatRoomDto
{
    public Guid ChatRoomId { get; set; }
    public string Name { get; set; }
    public ChatRoomUserDto[] Members { get; set; }
}
