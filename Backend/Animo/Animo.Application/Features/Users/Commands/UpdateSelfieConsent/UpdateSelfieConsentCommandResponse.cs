using Animo.Domain.Responses;

namespace Animo.Application.Features.Users.Commands.UpdateSelfieConsent;

public class UpdateSelfieConsentCommandResponse : BaseResponse
{
    public UpdateSelfieConsentCommandResponse()
    {

    }

    public UpdateSelfieConsentCommandDto SelfieConsent { get; set; }
}
