using FluentValidation;

namespace Animo.Application.Features.Message.Commands.CreateMessage;

public class CreateMessageCommandValidator : AbstractValidator<CreateMessageCommand>
{
    public CreateMessageCommandValidator()
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
