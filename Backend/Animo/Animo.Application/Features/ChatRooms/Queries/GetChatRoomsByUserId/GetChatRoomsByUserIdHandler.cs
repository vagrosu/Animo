using Animo.Application.Persistence;
using Animo.Domain.Entities;
using MediatR;
using System.Text;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomsByUserId;

public class GetChatRoomsByUserIdHandler(
    IChatRoomRepository chatRoomRepository,
    ITextMessageRepository textMessageRepository,
    IUserRepository userRepository
) : IRequestHandler<GetChatRoomsByUserIdQuery, GetChatRoomsByUserIdResponse>
{
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;
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

        var chatRooms = await _chatRoomRepository.FindByUserIdAsync(userId);
        if (!chatRooms.IsSuccess)
        {
            return new GetChatRoomsByUserIdResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { chatRooms.Error }
            };
        }

        var chatRoomDtos = new List<GetChatRoomByUserIdDto>();
        foreach (var chatRoom in chatRooms.Value)
        {
            var lastMessage = await _textMessageRepository.FindLastByChatRoomIdAsync(chatRoom.ChatRoomId);
            var lastActivity = ChatRoomHelpers.GetLastActivity(lastMessage.IsSuccess ? lastMessage.Value : null, chatRoom, userId);

            var chatRoomMembers = await _userRepository.FindByChatRoomIdAsync(chatRoom.ChatRoomId);
            var chatRoomName = ChatRoomHelpers.GetChatRoomName(chatRoom, userId, chatRoomMembers.IsSuccess ? chatRoomMembers.Value : new List<User>());

            chatRoomDtos.Add(new GetChatRoomByUserIdDto
            {
                ChatRoomId = chatRoom.ChatRoomId,
                Name = chatRoomName,
                IsGroupChat = chatRoomMembers.Value.Count > 2,
                LastUsedTime = chatRoom.LastUsedTime,
                LastActivity = lastActivity
            });
        }

        return new GetChatRoomsByUserIdResponse
        {
            Success = true,
            ChatRooms = chatRoomDtos.OrderByDescending(chatRoom => chatRoom.LastUsedTime).ToList()
        };
    }
}
