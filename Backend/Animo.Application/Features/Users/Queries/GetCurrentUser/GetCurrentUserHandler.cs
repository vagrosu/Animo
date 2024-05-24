using Animo.Application.Contracts.Identity;
using Animo.Domain.Common;
using MediatR;

namespace Animo.Application.Features.Users.Queries.GetCurrentUser;

public class GetCurrentUserHandler(ICurrentUserService currentUserService) : IRequestHandler<GetCurrentUserQuery, GetCurrentUserResponse>
{

    public async Task<GetCurrentUserResponse> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        if (currentUserService.IsAuthenticated() == false)
        {
            return new GetCurrentUserResponse
            {
                Success = false,
                StatusCode = 401,
                Message = "User is not authenticated"
            };
        }

        if (Guid.TryParse(currentUserService.UserId, out Guid userId) == false)
        {
            return new GetCurrentUserResponse
            {
                Success = false,
                StatusCode = 500,
                Message = "Invalid UserId"
            };
        }

        var claims = currentUserService.GetCurrentClaimsPrincipal()?.Claims
            .GroupBy(c => c.Type)
            .ToDictionary(g => g.Key, g => string.Join(", ", g.Select(c => c.Value)));

        return new GetCurrentUserResponse
        {
            Success = true,
            User = new GetCurrentUserDto
            {
                IsAuthenticated = true,
                UserId = userId,
                Claims = claims
            }
        };
    }
}
