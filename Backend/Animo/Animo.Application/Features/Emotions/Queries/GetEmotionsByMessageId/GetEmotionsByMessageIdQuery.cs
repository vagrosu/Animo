using MediatR;

namespace Animo.Application.Features.Emotions.Queries.GetEmotionsByMessageId;

public class GetEmotionsByMessageIdQuery : IRequest<GetEmotionsByMessageIdResponse>
{
    public string MessageId { get; set; }
}
