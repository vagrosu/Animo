using FluentValidation;

namespace Animo.Application.Features.MessageReactions.Commands.CreateOrUpdateMessageReaction;

public class CreateOrUpdateMessageReactionCommandValidator : AbstractValidator<CreateOrUpdateMessageReactionCommand>
{
    public CreateOrUpdateMessageReactionCommandValidator()
    {
        RuleFor(c => c.MessageId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();

        RuleFor(c => c.SenderId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();

        RuleFor(c => c.Emoji)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();
    }
}
