using Animo.Domain.Responses;

namespace Animo.Application.Features.Emotions.Queries.GetEmotionsByMessageId;

public class GetEmotionsByMessageIdResponse : BaseResponse
{
    public GetEmotionsByMessageIdDto MessageEmotions { get; set; }
    public GetEmotionsByMessageIdDto UserPhotoEmotions { get; set; }
}
