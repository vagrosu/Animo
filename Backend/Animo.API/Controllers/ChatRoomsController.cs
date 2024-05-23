using Animo.Application.Features.ChatRooms.Commands.CreateChatRoom;
using Animo.Application.Features.ChatRooms.Queries.GetChatRoomById;
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

    [HttpGet("by-user-id")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetChatRoomsByUserId([FromQuery] string userId)
    {
        var query = new GetChatRoomsByUserIdQuery() { UserId = userId };
        var result = await Mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{chatRoomId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetChatRoomById(string chatRoomId)
    {
        var query = new GetChatRoomByIdQuery() { ChatRoomId = chatRoomId };
        var result = await Mediator.Send(query);
        switch (result.StatusCode)
        {
            case 400:
                return BadRequest(result);
            case 404:
                return NotFound(result);
            default:
            {
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                break;
            }
        }

        return Ok(result);
    }
}
