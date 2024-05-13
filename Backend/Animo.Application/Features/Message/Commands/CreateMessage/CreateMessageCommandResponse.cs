using Animo.Domain.Responses;

namespace Animo.Application.Features.Message.Commands.CreateMessage;

public class CreateMessageCommandResponse : BaseResponse
{
    public CreateMessageCommandResponse() : base()
    {

    }

    public CreateMessageDto TextMessage { get; set; }
}
