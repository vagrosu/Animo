using Animo.Application.Contracts.Identity;
using Animo.Application.Persistence;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Text;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomById;

public class GetChatRoomByIdHandler(IChatRoomRepository chatRoomRepository, ITextMessageRepository textMessageRepository, ICurrentUserService currentUserService) : IRequestHandler<GetChatRoomByIdQuery, GetChatRoomByIdResponse>
{
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;
    private readonly ICurrentUserService _currentUserService = currentUserService;

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

        var lastMessage = await _textMessageRepository.FindLastByChatRoomIdAsync(chatRoomId);
        var lastActivity = new StringBuilder();
        if (lastMessage.IsSuccess)
        {
            if (lastMessage.Value.Sender.Id == Guid.Parse(userIdString))
            {
                lastActivity.Append("You: ");
            }
            else if (chatRoom.Value.ChatRoomMembers.Count > 2)
            {
                lastActivity.Append(lastMessage.Value.Sender.FirstName + ": ");
            }
            lastActivity.Append(lastMessage.Value.Text);
        }
        else
        {
            lastActivity.Append("Start conversation");
        }

        return new GetChatRoomByIdResponse
        {
            Success = true,
            ChatRoom = new GetChatRoomByIdDto
            {
                ChatRoomId = chatRoomId,
                Name = chatRoom.Value.Name,
                LastUsedTime = chatRoom.Value.LastUsedTime,
                LastActivity = lastActivity.ToString()
            }
        };

    }

}
