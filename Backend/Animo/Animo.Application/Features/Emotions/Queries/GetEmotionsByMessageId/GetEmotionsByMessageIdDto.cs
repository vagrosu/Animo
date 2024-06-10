namespace Animo.Application.Features.Emotions.Queries.GetEmotionsByMessageId;

public class GetEmotionsByMessageIdDto
{
    public bool IsSuccess { get; set; }
    public string? ErrorMessage { get; set; }
    public float Neutral { get; set; }
    public float Joy { get; set; }
    public float Surprise { get; set; }
    public float Sadness { get; set; }
    public float Disgust { get; set; }
    public float Anger { get; set; }
    public float Fear { get; set; }
}
