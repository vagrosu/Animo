using MediatR;

namespace Animo.Application.Features.Users.Commands.UpdateSelfieConsent;

public class UpdateSelfieConsentCommand : IRequest<UpdateSelfieConsentCommandResponse>
{
    public string UserId { get; set; }
    public bool IsSelfieConsentGiven { get; set; }
}
