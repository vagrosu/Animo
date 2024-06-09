using MediatR;

namespace Animo.Application.Features.Messages.Queries.GetTextMessageByChatRoomId;

public class GetMessageByChatRoomIdQuery : IRequest<GetMessageByChatRoomIdResponse>
{
    public string ChatRoomId { get; set; }
}
