using MediatR;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomById;

public class GetChatRoomByIdQuery : IRequest<GetChatRoomByIdResponse>
{
    public string ChatRoomId { get; set; }
}
