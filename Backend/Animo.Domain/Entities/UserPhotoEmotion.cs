using Animo.Domain.Common;

namespace Animo.Domain.Entities;

public class UserPhotoEmotion : Emotion
{
    public Guid UserPhotoEmotionId { get; set; }

    private UserPhotoEmotion(float joy, float surprise, float sadness, float disgust, float anger, float fear)
    {
        UserPhotoEmotionId = Guid.NewGuid();
        Joy = joy;
        Surprise = surprise;
        Sadness = sadness;
        Disgust = disgust;
        Anger = anger;
        Fear = fear;
    }

    public UserPhotoEmotion() { }
}
