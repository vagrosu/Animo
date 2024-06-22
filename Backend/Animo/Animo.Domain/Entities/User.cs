using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Animo.Domain.Entities;

public class User : IdentityUser<Guid>
{
    [MaxLength(256)]
    public string FirstName { get; set; }
    [MaxLength(256)]
    public string LastName { get; set; }
    public bool IsSelfieConsentAsked { get; set; }
    public bool IsSelfieConsentGiven { get; set; }
    // Join table
    public List<ChatRoomMember> ChatRoomMembers { get; set; } = new List<ChatRoomMember>();

    private User(string firstName, string lastName, List<ChatRoomMember> chatRoomMembers) : base()
    {
        FirstName = firstName;
        LastName = lastName;
        IsSelfieConsentGiven = false;
        IsSelfieConsentAsked = false;
        ChatRoomMembers = chatRoomMembers;
    }

    public User() { }
}
