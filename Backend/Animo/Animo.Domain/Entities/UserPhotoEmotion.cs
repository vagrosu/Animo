using Animo.Domain.Common;

namespace Animo.Domain.Entities;

public class UserPhotoEmotion : Emotion
{
    public Guid UserPhotoEmotionId { get; set; }

    private UserPhotoEmotion(bool isSuccess, float neutral, float joy, float surprise, float sadness, float disgust, float anger, float fear, string? errorMessage = null)
    {
        UserPhotoEmotionId = Guid.NewGuid();
        IsSuccess = isSuccess;
        Neutral = neutral;
        Joy = joy;
        Surprise = surprise;
        Sadness = sadness;
        Disgust = disgust;
        Anger = anger;
        Fear = fear;
        ErrorMessage = errorMessage;
    }

    public UserPhotoEmotion() { }

    public static Result<UserPhotoEmotion> Create(bool isSuccess, float neutral, float joy, float surprise, float sadness, float disgust, float anger, float fear, string? errorMessage = null)
    {
        if (neutral < 0 || neutral > 1)
        {
            return Result<UserPhotoEmotion>.Failure("Neutral must be between 0 and 1");
        }

        if (joy < 0 || joy > 1)
        {
            return Result<UserPhotoEmotion>.Failure("Joy must be between 0 and 1");
        }

        if (surprise < 0 || surprise > 1)
        {
            return Result<UserPhotoEmotion>.Failure("Surprise must be between 0 and 1");
        }

        if (sadness < 0 || sadness > 1)
        {
            return Result<UserPhotoEmotion>.Failure("Sadness must be between 0 and 1");
        }

        if (disgust < 0 || disgust > 1)
        {
            return Result<UserPhotoEmotion>.Failure("Disgust must be between 0 and 1");
        }

        if (anger < 0 || anger > 1)
        {
            return Result<UserPhotoEmotion>.Failure("Anger must be between 0 and 1");
        }

        if (fear < 0 || fear > 1)
        {
            return Result<UserPhotoEmotion>.Failure("Fear must be between 0 and 1");
        }

        return Result<UserPhotoEmotion>.Success(new UserPhotoEmotion(isSuccess, neutral, joy, surprise, sadness, disgust, anger, fear, errorMessage));
    }
}
