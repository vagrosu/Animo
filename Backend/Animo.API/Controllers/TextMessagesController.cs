using Animo.Application.Features.TextMessages.Commands;
using Animo.Application.Features.TextMessages.Commands.CreateTextMessage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Animo.Controllers;

public class TextMessagesController : ApiControllerBase
{
    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(CreateTextMessageCommand command)
    {
        var result = await Mediator.Send(command);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return Created("", result);
    }
}
