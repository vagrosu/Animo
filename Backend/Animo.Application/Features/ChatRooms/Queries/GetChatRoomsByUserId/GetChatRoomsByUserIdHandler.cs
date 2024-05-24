using Animo.Application.Persistence;
using MediatR;
using System.Text;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomsByUserId;

public class GetChatRoomsByUserIdHandler(IChatRoomRepository chatRoomRepository, ITextMessageRepository textMessageRepository, IUserRepository userRepository) : IRequestHandler<GetChatRoomsByUserIdQuery, GetChatRoomsByUserIdResponse>
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
            var lastActivity = new StringBuilder();
            if (lastMessage.IsSuccess)
            {
                if (lastMessage.Value.Sender.Id == userId)
                {
                    lastActivity.Append("You: ");
                }
                else if (chatRoom.ChatRoomMembers.Count > 2)
                {
                    lastActivity.Append(lastMessage.Value.Sender.FirstName + ": ");
                }
                lastActivity.Append(lastMessage.Value.Text);
            }
            else
            {
                lastActivity.Append("Start conversation");
            }

            chatRoomDtos.Add(new GetChatRoomByUserIdDto
            {
                ChatRoomId = chatRoom.ChatRoomId,
                Name = chatRoom.Name,
                LastUsedTime = chatRoom.LastUsedTime,
                LastActivity = lastActivity.ToString()
            });
        }

        return new GetChatRoomsByUserIdResponse
        {
            Success = true,
            ChatRooms = chatRoomDtos.OrderByDescending(chatRoom => chatRoom.LastUsedTime).ToList()
        };
    }
}
