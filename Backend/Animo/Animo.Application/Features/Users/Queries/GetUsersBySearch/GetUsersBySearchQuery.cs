using MediatR;

namespace Animo.Application.Features.Users.Queries.GetUsersBySearch;

public class GetUsersBySearchQuery : IRequest<GetUsersBySearchResponse>
{
    public string Search { get; set; }
}
