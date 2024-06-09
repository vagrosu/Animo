using Animo.Application.Features.Users;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomById;

public class GetChatRoomByIdDto
{
    public Guid ChatRoomId { get; set; }
    public string Name { get; set; }
    public List<ChatRoomUserDto> Members { get; set; }
    public DateTime LastUsedTime { get; set; }
    public string LastActivity { get; set; }
}
