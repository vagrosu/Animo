namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomById;

public class GetChatRoomByIdDto
{
    public Guid ChatRoomId { get; set; }
    public string Name { get; set; }
    public DateTime LastUsedTime { get; set; }
}
