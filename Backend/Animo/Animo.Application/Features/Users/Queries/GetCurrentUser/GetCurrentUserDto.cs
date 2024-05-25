namespace Animo.Application.Features.Users.Queries.GetCurrentUser;

public class GetCurrentUserDto
{
    public bool IsAuthenticated { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public Dictionary<string, string>? Claims { get; set; }
}
