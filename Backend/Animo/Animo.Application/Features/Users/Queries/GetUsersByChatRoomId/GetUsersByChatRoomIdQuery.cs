using MediatR;

namespace Animo.Application.Features.Users.Queries.GetUsersByChatRoomId;

public class GetUsersByChatRoomIdQuery : IRequest<GetUsersByChatRoomIdResponse>
{
    public string ChatRoomId { get; set; }
}
