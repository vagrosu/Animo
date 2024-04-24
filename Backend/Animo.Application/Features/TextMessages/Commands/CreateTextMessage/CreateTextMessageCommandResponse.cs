using Animo.Domain.Responses;

namespace Animo.Application.Features.TextMessages.Commands.CreateTextMessage;

public class CreateTextMessageCommandResponse : BaseResponse
{
    public CreateTextMessageCommandResponse() : base()
    {

    }

    public CreateTextMessageDto TextMessage { get; set; }
}
