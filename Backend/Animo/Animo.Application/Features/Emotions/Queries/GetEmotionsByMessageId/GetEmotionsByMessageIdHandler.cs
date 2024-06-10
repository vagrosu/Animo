using Animo.Application.Persistence;
using MediatR;

namespace Animo.Application.Features.Emotions.Queries.GetEmotionsByMessageId;

public class GetEmotionsByMessageIdHandler(
    ITextMessageRepository textMessageRepository,
    IMessageEmotionRepository messageEmotionRepository,
    IUserPhotoEmotionRepository userPhotoEmotionRepository
) : IRequestHandler<GetEmotionsByMessageIdQuery, GetEmotionsByMessageIdResponse>
{
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;
    private readonly IMessageEmotionRepository _messageEmotionRepository = messageEmotionRepository;
    private readonly IUserPhotoEmotionRepository _userPhotoEmotionRepository = userPhotoEmotionRepository;

    public async Task<GetEmotionsByMessageIdResponse> Handle(GetEmotionsByMessageIdQuery request, CancellationToken cancellationToken)
    {
        var validatorResult = await new GetEmotionsByMessageIdValidator().ValidateAsync(request, cancellationToken);
        if (!validatorResult.IsValid)
        {
            return new GetEmotionsByMessageIdResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.MessageId, out var messageId) == false)
        {
            return new GetEmotionsByMessageIdResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { $"Invalid messageId {request.MessageId}" }
            };
        }

        var message = await _textMessageRepository.FindByIdAsync(messageId);
        if (!message.IsSuccess)
        {
            return new GetEmotionsByMessageIdResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { message.Error }
            };
        }

        return new GetEmotionsByMessageIdResponse
        {
            Success = true,
            MessageEmotions = new GetEmotionsByMessageIdDto
            {
                IsSuccess = message.Value.MessageEmotion.IsSuccess,
                ErrorMessage = message.Value.MessageEmotion.ErrorMessage,
                Neutral = message.Value.MessageEmotion.Neutral,
                Joy = message.Value.MessageEmotion.Joy,
                Surprise = message.Value.MessageEmotion.Surprise,
                Sadness = message.Value.MessageEmotion.Sadness,
                Disgust = message.Value.MessageEmotion.Disgust,
                Anger = message.Value.MessageEmotion.Anger,
                Fear = message.Value.MessageEmotion.Fear
            },
            UserPhotoEmotions = new GetEmotionsByMessageIdDto
            {
                IsSuccess = message.Value.UserPhotoEmotion.IsSuccess,
                ErrorMessage = message.Value.UserPhotoEmotion.ErrorMessage,
                Neutral = message.Value.UserPhotoEmotion.Neutral,
                Joy = message.Value.UserPhotoEmotion.Joy,
                Surprise = message.Value.UserPhotoEmotion.Surprise,
                Sadness = message.Value.UserPhotoEmotion.Sadness,
                Disgust = message.Value.UserPhotoEmotion.Disgust,
                Anger = message.Value.UserPhotoEmotion.Anger,
                Fear = message.Value.UserPhotoEmotion.Fear
            }
        };
    }
}
