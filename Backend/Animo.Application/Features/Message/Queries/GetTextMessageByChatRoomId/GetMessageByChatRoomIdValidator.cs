using FluentValidation;

namespace Animo.Application.Features.Message.Queries.GetTextMessageByChatRoomId;

public class GetMessageByChatRoomIdValidator : AbstractValidator<GetMessageByChatRoomIdQuery>
{
    public GetMessageByChatRoomIdValidator()
    {
        RuleFor(c => c.ChatRoomId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();
    }
}
