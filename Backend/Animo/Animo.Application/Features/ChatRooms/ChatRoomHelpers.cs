using Animo.Application.Persistence;
using Animo.Domain.Entities;
using System.Text;

namespace Animo.Application.Features.ChatRooms;

public static class ChatRoomHelpers
{
    public static string GetLastActivity(TextMessage? lastMessageResult, ChatRoom chatRoom, Guid userId)
    {
        var lastActivity = new StringBuilder();
        if (lastMessageResult != null)
        {
            if (lastMessageResult.Sender.Id == userId)
            {
                lastActivity.Append("You: ");
            }
            else if (chatRoom.ChatRoomMembers.Count > 2)
            {
                lastActivity.Append(lastMessageResult.Sender.FirstName + ": ");
            }
            lastActivity.Append(lastMessageResult.Text);
        }
        else
        {
            lastActivity.Append("Start conversation");
        }

        return lastActivity.ToString();
    }

    public static string GetChatRoomName(ChatRoom chatRoom, Guid currentUserId, IEnumerable<User> chatRoomMembers)
    {
        if (!string.IsNullOrWhiteSpace(chatRoom.Name))
        {
            return chatRoom.Name;
        }

        if (chatRoom.ChatRoomMembers.Count > 2)
        {
            return string.Join(
                ", ",
                chatRoomMembers
                    .Where(m => m.Id != currentUserId)
                    .Select(m => m.FirstName)
            );
        }

        return chatRoomMembers
            .Where(m => m.Id != currentUserId)
            .Select(m => $"{m.FirstName} {m.LastName}")
            .FirstOrDefault() ?? "Unknown";
    }
}
