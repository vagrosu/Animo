using Animo.Domain.Responses;

namespace Animo.Application.Features.Messages.Queries.GetMessageById;

public class GetMessageByIdResponse : BaseResponse
{
    public ChatRoomMessageDto TextMessage { get; set; }
}
