namespace Animo.Application.Features.Users;

public class ChatRoomUserDto
{
    public Guid UserId { get; set; }
    public string? UserName { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}
