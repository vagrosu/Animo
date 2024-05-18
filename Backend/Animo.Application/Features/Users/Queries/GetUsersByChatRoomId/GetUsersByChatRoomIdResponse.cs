using Animo.Domain.Responses;

namespace Animo.Application.Features.Users.Queries.GetUsersByChatRoomId;

public class GetUsersByChatRoomIdResponse : BaseResponse
{
    public List<ChatRoomUserDto> Members { get; set; }
}
