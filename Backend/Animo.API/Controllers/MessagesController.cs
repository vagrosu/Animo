using Animo.Application.Features.Message.Commands.CreateMessage;
using Animo.Application.Features.Message.Queries.GetTextMessageByChatRoomId;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Animo.Controllers;

public class MessagesController : ApiControllerBase
{
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
        return Created("", result);
    }

    [HttpGet("{chatRoomId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByChatRoomId(string chatRoomId)
    {
        var query = new GetMessageByChatRoomIdQuery { ChatRoomId = chatRoomId };
        var result = await Mediator.Send(query);
        return Ok(result);
    }
}
