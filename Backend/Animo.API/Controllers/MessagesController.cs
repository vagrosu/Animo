using Animo.Application.Features.Message.Commands.CreateMessage;
using Animo.Application.Features.Message.Queries.GetMessageById;
using Animo.Application.Features.Message.Queries.GetTextMessageByChatRoomId;
using Animo.Application.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Animo.Controllers;

public class MessagesController(IHubContext<ChatRoomHub> hubContext) : ApiControllerBase
{
    private readonly IHubContext<ChatRoomHub> _hubContext = hubContext;

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

        await _hubContext.Clients.Group(command.ChatRoomId).SendAsync("ReceiveMessage", result.TextMessage.TextMessageId);
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

    [HttpGet]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByChatRoomId([FromQuery] string chatRoomId)
    {
        var query = new GetMessageByChatRoomIdQuery { ChatRoomId = chatRoomId };
        var result = await Mediator.Send(query);
        return Ok(result);
    }
}
