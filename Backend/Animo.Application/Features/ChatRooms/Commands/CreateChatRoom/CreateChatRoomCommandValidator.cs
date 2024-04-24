using FluentValidation;

namespace Animo.Application.Features.ChatRooms.Commands.CreateChatRoom;

public class CreateChatRoomCommandValidator : AbstractValidator<CreateChatRoomCommand>
{
    public CreateChatRoomCommandValidator()
    {
        RuleFor(c => c.Name)
            .MaximumLength(150).WithMessage("{PropertyName} must not exceed 150 characters.");

        RuleFor(c => c.MemberIds)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull()
            .Must(memberIds => memberIds.Count > 1).WithMessage("{PropertyName} must have at least 2 elements.");
    }
}
