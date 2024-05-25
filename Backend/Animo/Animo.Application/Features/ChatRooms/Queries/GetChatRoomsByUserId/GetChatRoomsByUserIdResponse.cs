using Animo.Domain.Responses;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomsByUserId;

public class GetChatRoomsByUserIdResponse : BaseResponse
{
    public List<GetChatRoomByUserIdDto> ChatRooms { get; set; }
}
