using MediatR;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomsByUserId;

public class GetChatRoomsByUserIdQuery : IRequest<GetChatRoomsByUserIdResponse>
{
    public string UserId { get; set; }
}
