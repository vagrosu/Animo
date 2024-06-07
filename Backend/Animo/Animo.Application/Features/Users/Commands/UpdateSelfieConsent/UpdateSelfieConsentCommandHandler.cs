using Animo.Application.Persistence;
using MediatR;

namespace Animo.Application.Features.Users.Commands.UpdateSelfieConsent;

public class UpdateSelfieConsentCommandHandler(IUserRepository userRepository) : IRequestHandler<UpdateSelfieConsentCommand, UpdateSelfieConsentCommandResponse>
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<UpdateSelfieConsentCommandResponse> Handle(UpdateSelfieConsentCommand request, CancellationToken cancellationToken)
    {
        var validatorResult = await new UpdateSelfieConsentCommandValidator().ValidateAsync(request, cancellationToken);
        if (!validatorResult.IsValid)
        {
            return new UpdateSelfieConsentCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.UserId, out var userId) == false)
        {
            return new UpdateSelfieConsentCommandResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { $"Invalid user id {request.UserId}" }
            };
        }

        var user = await _userRepository.FindByIdAsync(userId);
        if (!user.IsSuccess)
        {
            return new UpdateSelfieConsentCommandResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { user.Error }
            };
        }

        user.Value.IsSelfieConsentGiven = request.IsSelfieConsentGiven;
        user.Value.IsSelfieConsentAsked = true;

        var updateResult = await _userRepository.UpdateAsync(user.Value);
        if (!updateResult.IsSuccess)
        {
            return new UpdateSelfieConsentCommandResponse
            {
                Success = false,
                StatusCode = 500,
                ValidationsErrors = new List<string> { updateResult.Error }
            };
        }

        return new UpdateSelfieConsentCommandResponse
        {
            Success = true,
            StatusCode = 200,
            SelfieConsent = new UpdateSelfieConsentCommandDto
            {
                IsSelfieConsentGiven = request.IsSelfieConsentGiven
            }
        };
    }
}
