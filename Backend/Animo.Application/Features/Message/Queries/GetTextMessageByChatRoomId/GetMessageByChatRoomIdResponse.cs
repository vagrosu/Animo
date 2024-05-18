using Animo.Domain.Responses;

namespace Animo.Application.Features.Message.Queries.GetTextMessageByChatRoomId;

public class GetMessageByChatRoomIdResponse : BaseResponse
{
    public List<ChatRoomMessageDto> TextMessages { get; set; }
}
