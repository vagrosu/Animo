using Animo.Application.Persistence;
using FluentValidation;
using MediatR;

namespace Animo.Application.Features.Users.Queries.GetUsersBySearch;

public class GetUsersBySearchHandler(IUserRepository userRepository) : IRequestHandler<GetUsersBySearchQuery, GetUsersBySearchResponse>
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<GetUsersBySearchResponse> Handle(GetUsersBySearchQuery request, CancellationToken cancellationToken)
    {
        var validationResult = await new GetUsersBySearchValidator().ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return new GetUsersBySearchResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        var users = await _userRepository.SearchByNameAsync(request.Search);
        if (!users.IsSuccess)
        {
            return new GetUsersBySearchResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { users.Error }
            };
        }

        return new GetUsersBySearchResponse
        {
            Success = true,
            Users = users.Value.Select(user => new GetUsersBySearchDto
            {
                UserId = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
            }).ToList()
        };
    }
}
