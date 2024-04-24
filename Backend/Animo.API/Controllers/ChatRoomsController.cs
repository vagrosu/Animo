using Animo.Application.Features.ChatRooms.Commands.CreateChatRoom;
using Animo.Application.Features.ChatRooms.Queries.GetChatRoomsByUserId;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Animo.Controllers;

public class ChatRoomsController : ApiControllerBase
{
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(CreateChatRoomCommand command)
    {
        var result = await Mediator.Send(command);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return Created("", result);
    }

    [HttpGet("{userId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetChatRoomsByUserId(string userId)
    {
        var query = new GetChatRoomsByUserIdQuery() { UserId = userId };
        var result = await Mediator.Send(query);
        return Ok(result);
    }

}
