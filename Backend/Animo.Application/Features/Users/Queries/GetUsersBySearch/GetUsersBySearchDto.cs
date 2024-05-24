namespace Animo.Application.Features.Users.Queries.GetUsersBySearch;

public class GetUsersBySearchDto
{
    public Guid UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
}
