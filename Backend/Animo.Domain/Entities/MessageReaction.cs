using System.ComponentModel.DataAnnotations;

namespace Animo.Domain.Entities;

public class MessageReaction
{
    public Guid MessageReactionId { get; set; }
    public TextMessage TextMessage { get; set; }
    public User User { get; set; }
    [MaxLength(20)]
    public string Emoji { get; set; }

    public MessageReaction(TextMessage textMessage, User user, string emoji)
    {
        MessageReactionId = Guid.NewGuid();
        TextMessage = textMessage;
        User = user;
        Emoji = emoji;
    }

    public MessageReaction() { }
}
