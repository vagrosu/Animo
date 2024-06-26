using Animo.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace Animo.Domain.Entities;

public class MessageReaction
{
    public Guid MessageReactionId { get; set; }
    public TextMessage TextMessage { get; set; }
    public User User { get; set; }
    [MaxLength(20)]
    public string Emoji { get; set; }

    private MessageReaction(TextMessage textMessage, User user, string emoji)
    {
        MessageReactionId = Guid.NewGuid();
        TextMessage = textMessage;
        User = user;
        Emoji = emoji;
    }

    public MessageReaction() { }

    public static Result<MessageReaction> Create(TextMessage textMessage, User sender, string emoji)
    {
        if (textMessage == null)
        {
            return Result<MessageReaction>.Failure("Text message is required");
        }

        if (sender == null)
        {
            return Result<MessageReaction>.Failure("Sender is required");
        }

        if (string.IsNullOrWhiteSpace(emoji))
        {
            return Result<MessageReaction>.Failure("Emoji is required");
        }

        return Result<MessageReaction>.Success(new MessageReaction(textMessage, sender, emoji));
    }

    public Result<MessageReaction> Update(string emoji)
    {
        if (string.IsNullOrWhiteSpace(emoji))
        {
            return Result<MessageReaction>.Failure("Emoji is required");
        }

        Emoji = emoji;

        return Result<MessageReaction>.Success(this);
    }
}
