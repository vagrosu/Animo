using Animo.Domain.Enums;

namespace Animo.Domain.Entities;

public class ChatRoomMember
{
    public Guid UserId { get; set; }
    public Guid ChatRoomId { get; set; }
    public DateTime JoinedTime { get; set; } = DateTime.UtcNow;
    public UserChatRole ChatRole { get; set; }
}
