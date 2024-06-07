using FluentValidation;

namespace Animo.Application.Features.Users.Commands.UpdateSelfieConsent;

public class UpdateSelfieConsentCommandValidator : AbstractValidator<UpdateSelfieConsentCommand>
{
    public UpdateSelfieConsentCommandValidator()
    {
        RuleFor(p => p.UserId)
            .NotNull().WithMessage("{PropertyName} must not be null.")
            .NotEmpty().WithMessage("{PropertyName} must not be empty.");

        RuleFor(p => p.IsSelfieConsentGiven)
            .NotNull().WithMessage("{PropertyName} must not be null.");
    }
}
