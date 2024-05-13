namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomsByUserId;

public class GetChatRoomByUserIdDto
{
    public Guid ChatRoomId { get; set; }
    public string Name { get; set; }
    public DateTime LastUsedTime { get; set; }
}
