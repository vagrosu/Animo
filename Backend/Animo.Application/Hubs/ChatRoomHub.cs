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
        await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId.ToString());
    }
}
