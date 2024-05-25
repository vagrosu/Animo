using Animo.Application.Features.Message.Commands.CreateMessage;
using Animo.Application.Features.Message.Queries.GetMessageById;
using Animo.Application.Features.Message.Queries.GetTextMessageByChatRoomId;
using Animo.Application.Hubs;
using Animo.Application.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Animo.Controllers;

public class MessagesController(IHubContext<ChatRoomHub> chatRoomHubContext, IHubContext<ChatRoomsListHub> chatRoomsListHubContext, IUserRepository userRepository) : ApiControllerBase
{
    private readonly IHubContext<ChatRoomHub> _chatRoomHubContext = chatRoomHubContext;
    private readonly IHubContext<ChatRoomsListHub> _chatRoomsListHubContext = chatRoomsListHubContext;
    private readonly IUserRepository _userRepository = userRepository;

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(CreateMessageCommand command)
    {
        var result = await Mediator.Send(command);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        await _chatRoomHubContext.Clients.Group(command.ChatRoomId).SendAsync("ReceiveMessage", result.TextMessage.TextMessageId);

        if (Guid.TryParse(command.ChatRoomId, out var chatRoomId))
        {
            var chatMembers = await _userRepository.FindByChatRoomIdAsync(chatRoomId);
            if (chatMembers.IsSuccess)
            {
                foreach (var member in chatMembers.Value)
                {
                    await _chatRoomsListHubContext.Clients.Group(member.Id.ToString()).SendAsync("UpdateChatRoom", command.ChatRoomId);
                }
            }
        }


        return Created("", result);
    }

    [HttpGet("{messageId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByMessageId(string messageId)
    {
        var query = new GetMessageByIdQuery { MessageId = messageId };
        var result = await Mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("by-chat-room-id")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByChatRoomId([FromQuery] string chatRoomId)
    {
        var query = new GetMessageByChatRoomIdQuery { ChatRoomId = chatRoomId };
        var result = await Mediator.Send(query);
        return Ok(result);
    }
}
