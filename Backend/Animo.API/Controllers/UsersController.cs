using Animo.Application.Features.Users.Queries.GetUsersByChatRoomId;
using Animo.Application.Features.Users.Queries.GetUsersBySearch;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Animo.Controllers;

public class UsersController : ApiControllerBase
{
    [HttpGet("by-chat-room-id")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByChatRoomId([FromQuery] string chatRoomId)
    {
        var query = new GetUsersByChatRoomIdQuery { ChatRoomId = chatRoomId };
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

    [HttpGet("by-search")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBySearch([FromQuery] string search)
    {
        var query = new GetUsersBySearchQuery { Search = search };
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
