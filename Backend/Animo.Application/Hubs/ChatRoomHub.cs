using Microsoft.AspNetCore.SignalR;

namespace Animo.Application.Hubs;

public class ChatRoomHub : Hub
{
    public async Task SendMessage(Guid chatRoomId, string user, string message)
    {
        await Clients.Group(chatRoomId.ToString()).SendAsync("ReceiveMessage", user, message);
    }

    public async Task JoinChatRoom(Guid chatRoomId)
    {
        Console.WriteLine($"User {Context.ConnectionId} joined chat room {chatRoomId}");
        await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId.ToString());
    }

    public async Task LeaveChatRoom(Guid chatRoomId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatRoomId.ToString());
    }
}
