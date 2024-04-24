using Animo.Domain.Common;
using Animo.Domain.Enums;
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

    private ChatRoom(string name)
    {
        ChatRoomId = Guid.NewGuid();
        Name = name;
        CreatedTime = DateTime.UtcNow;
        LastUsedTime = DateTime.UtcNow;
    }

    public ChatRoom() {}

    public static Result<ChatRoom> Create(string name, List<User> members)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            return Result<ChatRoom>.Failure("Name is required");
        }

        if (members == null || members.Count == 0)
        {
            return Result<ChatRoom>.Failure("Members are required");
        }

        var chatRoom = new ChatRoom(name);
        foreach (var member in members)
        {
            chatRoom.ChatRoomMembers.Add(new ChatRoomMember
            {
                UserId = member.Id,
                ChatRoomId = chatRoom.ChatRoomId,
                ChatRole = UserChatRole.Member
            });
        }

        return Result<ChatRoom>.Success(chatRoom);
    }

    public Result<ChatRoom> AddMember(User member, UserChatRole chatRole)
    {
        if (member == null)
        {
            return Result<ChatRoom>.Failure("Member ID is required");
        }

        ChatRoomMembers.Add(new ChatRoomMember
        {
            UserId = member.Id,
            ChatRoomId = ChatRoomId,
            ChatRole = chatRole
        });

        return Result<ChatRoom>.Success(this);
    }
}
