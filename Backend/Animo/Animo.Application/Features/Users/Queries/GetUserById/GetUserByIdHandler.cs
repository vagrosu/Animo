using Animo.Application.Persistence;
using MediatR;

namespace Animo.Application.Features.Users.Queries.GetUserById;

public class GetUserByIdHandler(IUserRepository userRepository) : IRequestHandler<GetUserByIdQuery, GetUserByIdResponse>
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<GetUserByIdResponse> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var validatorResult = await new GetUserByIdValidator().ValidateAsync(request, cancellationToken);
        if (validatorResult.IsValid == false)
        {
            return new GetUserByIdResponse
            {
                Success = false,
                StatusCode = 400,
                Message = "Validation error",
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.UserId, out var userId) == false)
        {
            return new GetUserByIdResponse
            {
                Success = false,
                StatusCode = 400,
                Message = "Invalid UserId"
            };
        }

        var user = await _userRepository.FindByIdAsync(userId);
        if (!user.IsSuccess)
        {
            return new GetUserByIdResponse
            {
                Success = false,
                StatusCode = 404,
                Message = "User not found"
            };
        }

        return new GetUserByIdResponse
        {
            Success = true,
            User = new GetUserByIdDto
            {
                Username = user.Value.UserName,
                UserId = user.Value.Id,
                FirstName = user.Value.FirstName,
                LastName = user.Value.LastName,
                Email = user.Value.Email,
                PhoneNumber = user.Value.PhoneNumber,
                IsSelfieConsentGiven = user.Value.IsSelfieConsentGiven
            }
        };
    }
}
