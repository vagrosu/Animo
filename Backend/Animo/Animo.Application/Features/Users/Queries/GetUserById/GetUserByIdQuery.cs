using MediatR;

namespace Animo.Application.Features.Users.Queries.GetUserById;

public class GetUserByIdQuery: IRequest<GetUserByIdResponse>
{
    public string UserId { get; set; }
}
