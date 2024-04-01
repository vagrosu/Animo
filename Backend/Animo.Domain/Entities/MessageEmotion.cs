using Animo.Domain.Common;

namespace Animo.Domain.Entities;

public class MessageEmotion : Emotion
{
    public Guid MessageEmotionId { get; set; }

    private MessageEmotion(float joy, float surprise, float sadness, float disgust, float anger, float fear)
    {
        MessageEmotionId = Guid.NewGuid();
        Joy = joy;
        Surprise = surprise;
        Sadness = sadness;
        Disgust = disgust;
        Anger = anger;
        Fear = fear;
    }

    public MessageEmotion() { }
}
