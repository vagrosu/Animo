using Animo.Application.Features.Emotions.Queries.GetEmotionsByMessageId;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Animo.Controllers;

public class EmotionsController : ApiControllerBase
{
    [HttpGet("by-message-id")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetEmotionsByMessageId([FromQuery] string messageId)
    {
        var query = new GetEmotionsByMessageIdQuery { MessageId = messageId };
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
