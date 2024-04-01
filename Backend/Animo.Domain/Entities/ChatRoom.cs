using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Animo.Domain.Entities;

public class ChatRoom
{
    public Guid ChatRoomId { get; set; }
    [MaxLength(256)]
    public string Name { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastUsedTime { get; set; }
    // Join table
    public List<ChatRoomMember> ChatRoomMembers { get; set; } = new List<ChatRoomMember>();

    private ChatRoom(string name, List<User> members, List<ChatRoomMember> chatRoomMembers)
    {
        ChatRoomId = Guid.NewGuid();
        Name = name;
        CreatedTime = DateTime.UtcNow;
        LastUsedTime = DateTime.UtcNow;
        ChatRoomMembers = chatRoomMembers;
    }

    public ChatRoom() {}
}
