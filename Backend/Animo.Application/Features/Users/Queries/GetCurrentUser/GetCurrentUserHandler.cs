using Animo.Application.Contracts.Identity;
using Animo.Application.Persistence;
using Animo.Domain.Common;
using MediatR;

namespace Animo.Application.Features.Users.Queries.GetCurrentUser;

public class GetCurrentUserHandler(ICurrentUserService currentUserService, IUserRepository userRepository) : IRequestHandler<GetCurrentUserQuery, GetCurrentUserResponse>
{
    private readonly ICurrentUserService _currentUserService = currentUserService;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<GetCurrentUserResponse> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        if (_currentUserService.IsAuthenticated() == false)
        {
            return new GetCurrentUserResponse
            {
                Success = false,
                StatusCode = 401,
                Message = "User is not authenticated"
            };
        }

        if (Guid.TryParse(_currentUserService.UserId, out Guid userId) == false)
        {
            return new GetCurrentUserResponse
            {
                Success = false,
                StatusCode = 500,
                Message = "Invalid UserId"
            };
        }

        var user = await _userRepository.FindByIdAsync(userId);
        if (!user.IsSuccess)
        {
            return new GetCurrentUserResponse
            {
                Success = false,
                StatusCode = 404,
                Message = "User not found"
            };
        }

        var claims = _currentUserService.GetCurrentClaimsPrincipal()?.Claims
            .GroupBy(c => c.Type)
            .ToDictionary(g => g.Key, g => string.Join(", ", g.Select(c => c.Value)));

        return new GetCurrentUserResponse
        {
            Success = true,
            User = new GetCurrentUserDto
            {
                IsAuthenticated = true,
                UserId = userId,
                FirstName = user.Value.FirstName,
                LastName = user.Value.LastName,
                Claims = claims
            }
        };
    }
}
