using Animo.Application.Contracts.Identity;
using Animo.Application.Features.Users;
using Animo.Application.Persistence;
using Animo.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Text;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomById;

public class GetChatRoomByIdHandler(
    IChatRoomRepository chatRoomRepository,
    ITextMessageRepository textMessageRepository,
    ICurrentUserService currentUserService,
    IUserRepository userRepository
) : IRequestHandler<GetChatRoomByIdQuery, GetChatRoomByIdResponse>
{
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;
    private readonly ICurrentUserService _currentUserService = currentUserService;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<GetChatRoomByIdResponse> Handle(GetChatRoomByIdQuery request, CancellationToken cancellationToken)
    {
        var validationResult = await new GetChatRoomByIdValidator().ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            return new GetChatRoomByIdResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = validationResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        if (Guid.TryParse(request.ChatRoomId, out var chatRoomId) == false)
        {
            return new GetChatRoomByIdResponse
            {
                Success = false,
                StatusCode = 400,
                ValidationsErrors = new List<string> { $"Invalid chatRoomId {request.ChatRoomId}" }
            };
        }

        var chatRoom = await _chatRoomRepository.FindByIdAsync(chatRoomId);
        if (!chatRoom.IsSuccess)
        {
            return new GetChatRoomByIdResponse
            {
                Success = false,
                StatusCode = 404,
                ValidationsErrors = new List<string> { chatRoom.Error }
            };
        }

        var userIdString = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userIdString))
        {
            return new GetChatRoomByIdResponse
            {
                Success = false,
                StatusCode = 401,
                ValidationsErrors = new List<string> { "User is not authenticated" }
            };
        }

        if (Guid.TryParse(userIdString, out var userId) == false)
        {
            return new GetChatRoomByIdResponse
            {
                Success = false,
                StatusCode = 500,
                ValidationsErrors = new List<string> { "Failed to extract userId." }
            };
        }

        var lastMessage = await _textMessageRepository.FindLastByChatRoomIdAsync(chatRoomId);
        var lastActivity = ChatRoomHelpers.GetLastActivity(lastMessage.IsSuccess ? lastMessage.Value : null, chatRoom.Value, userId);

        var chatRoomMembers = await _userRepository.FindByChatRoomIdAsync(chatRoomId);
        var chatRoomName = ChatRoomHelpers.GetChatRoomName(chatRoom.Value, userId, chatRoomMembers.IsSuccess ? chatRoomMembers.Value : new List<User>());

        return new GetChatRoomByIdResponse
        {
            Success = true,
            ChatRoom = new GetChatRoomByIdDto
            {
                ChatRoomId = chatRoomId,
                Name = chatRoomName,
                Members = chatRoomMembers.IsSuccess ? chatRoomMembers.Value.Select(m => new ChatRoomUserDto
                {
                    UserId = m.Id,
                    UserName = m.UserName,
                    FirstName = m.FirstName,
                    LastName = m.LastName
                }).ToList() : [],
                LastUsedTime = chatRoom.Value.LastUsedTime,
                LastActivity = lastActivity
            }
        };

    }

}
