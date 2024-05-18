using FluentValidation;

namespace Animo.Application.Features.Users.Queries.GetUsersByChatRoomId;

public class GetUsersByChatRoomIdValidator : AbstractValidator<GetUsersByChatRoomIdQuery>
{
    public GetUsersByChatRoomIdValidator()
    {
        RuleFor(c => c.ChatRoomId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();
    }
}
