using FluentValidation;

namespace Animo.Application.Features.MessageReactions.Commands.DeleteMessageReaction;

public class DeleteMessageReactionCommandValidator : AbstractValidator<DeleteMessageReactionCommand>
{
    public DeleteMessageReactionCommandValidator()
    {
        RuleFor(c => c.MessageReactionId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();
    }
}
