using Animo.Application.Persistance;
using Animo.Domain.Common;
using Animo.Domain.Entities;

namespace Animo.Application.Persistence;

public interface IUserRepository : IAsyncRepository<User>
{
    Task<Result<User>> FindByEmailAsync(string email);
    Task<Result<User>> FindByPhoneNumberAsync(string phoneNumber);
}
