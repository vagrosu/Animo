using System.Security.Claims;

namespace Animo.Application.Contracts.Identity;

public interface ICurrentUserService
{
    string UserId { get; }
    ClaimsPrincipal? GetCurrentClaimsPrincipal();
    bool IsAuthenticated();
}
