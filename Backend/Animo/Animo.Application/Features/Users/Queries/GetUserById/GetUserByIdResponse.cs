using Animo.Domain.Responses;

namespace Animo.Application.Features.Users.Queries.GetUserById;

public class GetUserByIdResponse : BaseResponse
{
    public GetUserByIdDto User { get; set; }
}
