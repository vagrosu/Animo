using Animo.Domain.Responses;

namespace Animo.Application.Features.Message.Queries.GetTextMessageByChatRoomId;

public class GetMessageByChatRoomIdResponse : BaseResponse
{
    public List<GetMessageByChatRoomIdDto> TextMessages { get; set; }
}
