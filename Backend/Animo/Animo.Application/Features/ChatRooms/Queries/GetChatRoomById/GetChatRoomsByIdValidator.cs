using Animo.Application.Features.Users.Queries.GetUsersBySearch;
using FluentValidation;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomById;

public class GetChatRoomByIdValidator : AbstractValidator<GetChatRoomByIdQuery>
{
    public GetChatRoomByIdValidator()
    {
        RuleFor(c => c.ChatRoomId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();
    }
}
