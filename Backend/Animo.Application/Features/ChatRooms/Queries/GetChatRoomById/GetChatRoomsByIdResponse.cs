using Animo.Domain.Responses;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomById;

public class GetChatRoomByIdResponse : BaseResponse
{
    public GetChatRoomByIdDto ChatRoom { get; set; }
}
