namespace Animo.Application.Features.Users.Queries.GetUserById;

public class GetUserByIdDto
{
    public Guid UserId { get; set; }
    public string? Username { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public bool IsSelfieConsentGiven { get; set; }
}
