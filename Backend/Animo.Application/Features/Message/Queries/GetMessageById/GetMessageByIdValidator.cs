using FluentValidation;

namespace Animo.Application.Features.Message.Queries.GetMessageById;

public class GetMessageByIdValidator : AbstractValidator<GetMessageByIdQuery>
{
    public GetMessageByIdValidator()
    {
        RuleFor(c => c.MessageId)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();
    }
}
