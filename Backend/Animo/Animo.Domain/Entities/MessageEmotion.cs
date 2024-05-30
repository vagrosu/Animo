using Animo.Domain.Common;

namespace Animo.Domain.Entities;

public class MessageEmotion : Emotion
{
    public Guid MessageEmotionId { get; set; }

    private MessageEmotion(float neutral, float joy, float surprise, float sadness, float disgust, float anger, float fear)
    {
        MessageEmotionId = Guid.NewGuid();
        Neutral = neutral;
        Joy = joy;
        Surprise = surprise;
        Sadness = sadness;
        Disgust = disgust;
        Anger = anger;
        Fear = fear;
    }

    public MessageEmotion() { }

    public static Result<MessageEmotion> Create(float neutral, float joy, float surprise, float sadness, float disgust, float anger, float fear)
    {
        if (neutral < 0 || neutral > 1)
        {
            return Result<MessageEmotion>.Failure("Neutral must be between 0 and 1");
        }
        if (joy < 0 || joy > 1)
        {
            return Result<MessageEmotion>.Failure("Joy must be between 0 and 1");
        }

        if (surprise < 0 || surprise > 1)
        {
            return Result<MessageEmotion>.Failure("Surprise must be between 0 and 1");
        }

        if (sadness < 0 || sadness > 1)
        {
            return Result<MessageEmotion>.Failure("Sadness must be between 0 and 1");
        }

        if (disgust < 0 || disgust > 1)
        {
            return Result<MessageEmotion>.Failure("Disgust must be between 0 and 1");
        }

        if (anger < 0 || anger > 1)
        {
            return Result<MessageEmotion>.Failure("Anger must be between 0 and 1");
        }

        if (fear < 0 || fear > 1)
        {
            return Result<MessageEmotion>.Failure("Fear must be between 0 and 1");
        }

        return Result<MessageEmotion>.Success(new MessageEmotion(neutral, joy, surprise, sadness, disgust, anger, fear));
    }
}
