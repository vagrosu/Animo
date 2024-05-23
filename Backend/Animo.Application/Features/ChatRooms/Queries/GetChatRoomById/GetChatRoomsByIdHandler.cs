using Animo.Application.Persistence;
using MediatR;

namespace Animo.Application.Features.ChatRooms.Queries.GetChatRoomById;

public class GetChatRoomByIdHandler(IChatRoomRepository chatRoomRepository) : IRequestHandler<GetChatRoomByIdQuery, GetChatRoomByIdResponse>
{
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;

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

        return new GetChatRoomByIdResponse
        {
            Success = true,
            ChatRoom = new GetChatRoomByIdDto
            {
                ChatRoomId = chatRoomId,
                Name = chatRoom.Value.Name,
                LastUsedTime = chatRoom.Value.LastUsedTime
            }
        };

    }

}
