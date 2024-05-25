using MediatR;

namespace Animo.Application.Features.Message.Queries.GetTextMessageByChatRoomId;

public class GetMessageByChatRoomIdQuery : IRequest<GetMessageByChatRoomIdResponse>
{
    public string ChatRoomId { get; set; }
}
