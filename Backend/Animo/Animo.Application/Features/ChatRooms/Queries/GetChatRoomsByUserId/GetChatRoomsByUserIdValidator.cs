using FluentValidation;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomsByUserId;

public class GetChatRoomsByUserIdValidator : AbstractValidator<GetChatRoomsByUserIdQuery>
{
    public GetChatRoomsByUserIdValidator()
    {
        RuleFor(c => c.UserId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();
    }
}
