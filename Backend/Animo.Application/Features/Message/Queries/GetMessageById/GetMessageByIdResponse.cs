using Animo.Domain.Responses;

namespace Animo.Application.Features.Message.Queries.GetMessageById;

public class GetMessageByIdResponse : BaseResponse
{
    public ChatRoomMessageDto TextMessage { get; set; }
}
