namespace Animo.Application.Features.Users.Queries.GetCurrentUser;

public class GetCurrentUserDto
{
    public bool IsAuthenticated { get; set; }
    public Guid UserId { get; set; }
    public Dictionary<string, string>? Claims { get; set; }
}
