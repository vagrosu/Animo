using Animo.Application.Contracts.Identity;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Infrastructure.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public string UserId => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public ClaimsPrincipal? GetCurrentClaimsPrincipal()
    {
        return httpContextAccessor.HttpContext?.User;
    }

    public bool IsAuthenticated()
    {
        return GetCurrentClaimsPrincipal()?.Identity?.IsAuthenticated ?? false;
    }
}
