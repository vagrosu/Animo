using Animo.Domain.Responses;

namespace Animo.Application.Features.Messages.Queries.GetTextMessageByChatRoomId;

public class GetMessageByChatRoomIdResponse : BaseResponse
{
    public List<ChatRoomMessageDto> TextMessages { get; set; }
}
