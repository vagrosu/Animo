using Animo.Domain.Common;

namespace Animo.Domain.Entities;

public class ImageMessage : Message
{
    public string ImageUrl { get; set; }

    private ImageMessage(User sender, ChatRoom chatRoom, string imageUrl, MessageEmotion messageEmotion, UserPhotoEmotion userPhotoEmotion, TextMessage? repliedMessage, bool? isForwarded)
    {
        ChatRoom = chatRoom;
        Sender = sender;
        ImageUrl = imageUrl;
        MessageEmotion = messageEmotion;
        UserPhotoEmotion = userPhotoEmotion;
        RepliedMessage = repliedMessage;
        SentTime = DateTime.UtcNow;
        IsForwarded = isForwarded ?? false;
    }

    public ImageMessage() {}
}
