using FluentValidation;

namespace Animo.Application.Features.Emotions.Queries.GetEmotionsByMessageId;

public class GetEmotionsByMessageIdValidator : AbstractValidator<GetEmotionsByMessageIdQuery>
{
    public GetEmotionsByMessageIdValidator()
    {
        RuleFor(p => p.MessageId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull().WithMessage("{PropertyName} is required.");
    }
}
