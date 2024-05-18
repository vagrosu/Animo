using Animo.Application.Persistence;
using MediatR;

namespace Animo.Application.Features.Users.Queries.GetUsersByChatRoomId;

public class GetUsersByChatRoomIdHandler(IUserRepository userRepository) : IRequestHandler<GetUsersByChatRoomIdQuery, GetUsersByChatRoomIdResponse>
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<GetUsersByChatRoomIdResponse> Handle(GetUsersByChatRoomIdQuery request, CancellationToken cancellationToken)
    {
        var validationResult = await new GetUsersByChatRoomIdValidator().ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return new GetUsersByChatRoomIdResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.ChatRoomId, out var chatRoomId) == false)
        {
            return new GetUsersByChatRoomIdResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { $"Invalid chatRoomId {request.ChatRoomId}" }
            };
        }

        var users = await _userRepository.FindByChatRoomIdAsync(chatRoomId);
        if (!users.IsSuccess)
        {
            return new GetUsersByChatRoomIdResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { users.Error }
            };
        }

        return new GetUsersByChatRoomIdResponse
        {
            Success = true,
            Members = users.Value.Select(user => new ChatRoomUserDto
            {
                UserId = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
            }).ToList()
        };
    }
}
