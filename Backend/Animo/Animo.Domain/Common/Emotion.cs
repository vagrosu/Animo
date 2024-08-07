using System.ComponentModel.DataAnnotations;

namespace Animo.Domain.Common;

public class Emotion
{
    public bool IsSuccess { get; set; }
    [MaxLength(256)]
    public string? ErrorMessage { get; set; }
    public float Neutral { get; set; }
    public float Joy { get; set; }
    public float Surprise { get; set; }
    public float Sadness { get; set; }
    public float Disgust { get; set; }
    public float Anger { get; set; }
    public float Fear { get; set; }

    public static Emotion operator+(Emotion a, Emotion b)
    {
        return new Emotion
        {
            Neutral = a.Neutral + b.Neutral,
            Joy = a.Joy + b.Joy,
            Surprise = a.Surprise + b.Surprise,
            Sadness = a.Sadness + b.Sadness,
            Disgust = a.Disgust + b.Disgust,
            Anger = a.Anger + b.Anger,
            Fear = a.Fear + b.Fear
        };
    }

    public static KeyValuePair<string, float> Max(Emotion emotion)
    {
        var emotions = new Dictionary<string, float>
        {
            { nameof(Neutral), emotion.Neutral },
            { nameof(Joy), emotion.Joy },
            { nameof(Surprise), emotion.Surprise },
            { nameof(Sadness), emotion.Sadness },
            { nameof(Disgust), emotion.Disgust },
            { nameof(Anger), emotion.Anger },
            { nameof(Fear), emotion.Fear }
        };

        var maxEmotionValue = emotions.Max(e => e.Value);
        return emotions.FirstOrDefault(e => Math.Abs(e.Value - maxEmotionValue) <= float.Epsilon);
    }
}
