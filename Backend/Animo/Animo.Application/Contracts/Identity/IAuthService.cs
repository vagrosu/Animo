using Animo.Application.Models.Identity;

namespace Animo.Application.Contracts.Identity;

public interface IAuthService
{
    Task<(int, string)> RegistrationAsync(RegistrationModel model);
    Task<(int, string)> LoginAsync(LoginModel model);
}
