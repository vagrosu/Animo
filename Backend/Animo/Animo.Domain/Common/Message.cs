using Animo.Domain.Entities;

namespace Animo.Domain.Common;

public abstract class Message
{
    public Guid MessageId { get; set; } = Guid.NewGuid();
    public ChatRoom ChatRoom { get; set; }
    public User Sender { get; set; }
    public DateTime SentTime { get; set; }
    public MessageEmotion MessageEmotion { get; set; }
    public UserPhotoEmotion UserPhotoEmotion { get; set; }
    public List<MessageReaction> MessageReactions { get; set; } = new List<MessageReaction>();
    public Message? RepliedMessage { get; set; }
    public bool IsForwarded { get; set; }

}
