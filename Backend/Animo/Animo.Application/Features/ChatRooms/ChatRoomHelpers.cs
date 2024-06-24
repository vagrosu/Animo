using Animo.Application.Persistence;
using Animo.Domain.Entities;
using Microsoft.Extensions.Primitives;
using System.Text;

namespace Animo.Application.Features.ChatRooms;

public static class ChatRoomHelpers
{
    private const string PlainTextFlag = "/$/plain/$/";

    public static string GetLastActivity(TextMessage? lastMessageResult, ChatRoom chatRoom, Guid userId)
    {
        var lastActivity = new StringBuilder();
        if (lastMessageResult != null)
        {
            if (lastMessageResult.Sender.Id == userId)
            {
                lastActivity.Append($"{PlainTextFlag}You: {PlainTextFlag}");
            }
            else if (chatRoom.ChatRoomMembers.Count > 2)
            {
                lastActivity.Append(PlainTextFlag + lastMessageResult.Sender.FirstName + ": " + PlainTextFlag);
            }
            lastActivity.Append(lastMessageResult.Text);
        }
        else
        {
            lastActivity.Append($"{PlainTextFlag}Start conversation{PlainTextFlag}");
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
