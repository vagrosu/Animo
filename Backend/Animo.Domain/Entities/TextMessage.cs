using Animo.Domain.Common;

namespace Animo.Domain.Entities;

public class TextMessage : Message
{
    public string Text { get; set; }

    private TextMessage(User sender, ChatRoom chatRoom, string text, MessageEmotion messageEmotion, UserPhotoEmotion userPhotoEmotion, TextMessage? repliedMessage, bool? isForwarded)
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
}
