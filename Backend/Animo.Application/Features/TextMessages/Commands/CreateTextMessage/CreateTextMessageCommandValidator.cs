using FluentValidation;

namespace Animo.Application.Features.TextMessages.Commands.CreateTextMessage;

public class CreateTextMessageCommandValidator : AbstractValidator<CreateTextMessageCommand>
{
    public CreateTextMessageCommandValidator()
    {
        RuleFor(c => c.ChatRoomId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();

        RuleFor(c => c.SenderId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();

        RuleFor(c => c.Text)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull()
            .MaximumLength(5000).WithMessage("{PropertyName} must not exceed 5000 characters.");
    }
}
