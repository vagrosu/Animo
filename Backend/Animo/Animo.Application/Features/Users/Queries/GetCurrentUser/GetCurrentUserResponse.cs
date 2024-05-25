using Animo.Domain.Responses;

namespace Animo.Application.Features.Users.Queries.GetCurrentUser;

public class GetCurrentUserResponse : BaseResponse
{
    public GetCurrentUserDto User { get; set; }
}
