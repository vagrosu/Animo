using Microsoft.AspNetCore.SignalR;

namespace Animo.Application.Hubs;

public class ChatRoomsListHub : Hub
{
    public async Task ChatRoomUpdated(Guid userId, Guid chatRoomId)
    {
        await Clients.Group(userId.ToString()).SendAsync("ChatRoomUpdated", chatRoomId);
    }

    public async Task JoinChatRoomsList(Guid userId)
    {
        Console.WriteLine($"User {Context.ConnectionId} joined chat room list {userId}");
        await Groups.AddToGroupAsync(Context.ConnectionId, userId.ToString());
    }

    public async Task LeaveChatRoomsList(Guid userId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId.ToString());
    }

}
