using Animo.Application.Persistence;
using MediatR;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomsByUserId;

public class GetChatRoomsByUserIdHandler(IChatRoomRepository chatRoomRepository, IUserRepository userRepository) : IRequestHandler<GetChatRoomsByUserIdQuery, GetChatRoomsByUserIdResponse>
{
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<GetChatRoomsByUserIdResponse> Handle(GetChatRoomsByUserIdQuery request, CancellationToken cancellationToken)
    {
        var validatorResult = await new GetChatRoomsByUserIdValidator().ValidateAsync(request, cancellationToken);
        if (!validatorResult.IsValid)
        {
            return new GetChatRoomsByUserIdResponse
            {
                Success = false,
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.UserId, out var userId) == false)
        {
            return new GetChatRoomsByUserIdResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { $"Invalid userId {request.UserId}." }
            };
        }
        var user = await _userRepository.FindByIdAsync(userId);
        if (!user.IsSuccess)
        {
            return new GetChatRoomsByUserIdResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { user.Error }
            };
        }

        var chatRooms = await _chatRoomRepository.GetByUserIdAsync(userId);
        if (!chatRooms.IsSuccess)
        {
            return new GetChatRoomsByUserIdResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { chatRooms.Error }
            };
        }

        return new GetChatRoomsByUserIdResponse
        {
            Success = true,
            ChatRooms = chatRooms.Value.Select(c => new GetChatRoomByUserIdDto
            {
                ChatRoomId = c.ChatRoomId,
                Name = c.Name,
                LastUsedTime = c.LastUsedTime
            }).OrderByDescending(chatRoom => chatRoom.LastUsedTime).ToList()
        };
    }
}
