using Animo.Domain.Responses;

namespace Animo.Application.Features.ChatRooms.Commands.CreateChatRoom;

public class CreateChatRoomCommandResponse : BaseResponse
{
    public CreateChatRoomCommandResponse() : base()
    {
    }

    public CreateChatRoomDto ChatRoom { get; set; }
}
