using Animo.Domain.Responses;

namespace Animo.Application.Features.Users.Queries.GetUsersBySearch;

public class GetUsersBySearchResponse : BaseResponse
{
    public List<GetUsersBySearchDto> Users { get; set; }
}
