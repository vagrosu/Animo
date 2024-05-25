using FluentValidation;

namespace Animo.Application.Features.Users.Queries.GetUsersBySearch;

public class GetUsersBySearchValidator : AbstractValidator<GetUsersBySearchQuery>
{
    public GetUsersBySearchValidator()
    {
        RuleFor(c => c.Search)
            .NotEmpty().WithMessage("{PropertyName} is required.")
            .NotNull();
    }
}
