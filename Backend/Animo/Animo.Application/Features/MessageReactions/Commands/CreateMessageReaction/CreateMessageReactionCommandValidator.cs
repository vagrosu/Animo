using Animo.Application.Features.Messages.Commands.CreateMessage;
using FluentValidation;

namespace Animo.Application.Features.MessageReactions.Commands.CreateMessageReaction;

public class CreateMessageReactionCommandValidator : AbstractValidator<CreateMessageReactionCommand>
{
    public CreateMessageReactionCommandValidator()
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
