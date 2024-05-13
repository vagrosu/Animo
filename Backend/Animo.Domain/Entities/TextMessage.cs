using Animo.Domain.Common;

namespace Animo.Domain.Entities;

public class TextMessage : Message
{
    public string Text { get; set; }

    private TextMessage(User sender, ChatRoom chatRoom, string text, MessageEmotion? messageEmotion, UserPhotoEmotion? userPhotoEmotion, TextMessage? repliedMessage, bool? isForwarded)
    {
        ChatRoom = chatRoom;
        Sender = sender;
        Text = text;
        MessageEmotion = messageEmotion;
        UserPhotoEmotion = userPhotoEmotion;
        RepliedMessage = repliedMessage;
        SentTime = DateTime.UtcNow;
        IsForwarded = isForwarded ?? false;
    }

    public TextMessage() {}

    public static Result<TextMessage> Create(User sender, ChatRoom chatRoom, string text, MessageEmotion messageEmotion, UserPhotoEmotion userPhotoEmotion, TextMessage? repliedMessage, bool? isForwarded)
    {
        if (sender == null)
        {
            return Result<TextMessage>.Failure("Sender is required");
        }

        if (chatRoom == null)
        {
            return Result<TextMessage>.Failure("Chat room is required");
        }

        if (string.IsNullOrWhiteSpace(text))
        {
            return Result<TextMessage>.Failure("Text is required");
        }

        return Result<TextMessage>.Success(new TextMessage(sender, chatRoom, text, messageEmotion, userPhotoEmotion, repliedMessage, isForwarded));
    }
}
