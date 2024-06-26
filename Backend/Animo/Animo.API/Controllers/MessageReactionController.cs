using Animo.Application.Features.MessageReactions.Commands.CreateMessageReaction;
using Animo.Application.Hubs;
using Animo.Application.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Animo.Controllers;

public class MessageReactionController(
    IHubContext<ChatRoomHub> chatRoomHubContext,
    IChatRoomRepository chatRoomRepository) : ApiControllerBase
{
    private readonly IHubContext<ChatRoomHub> _chatRoomHubContext = chatRoomHubContext;
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;

    [HttpPost]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create(CreateMessageReactionCommand command)
    {
        var result = await Mediator.Send(command);
        switch (result.StatusCode)
        {
            case 400:
                return BadRequest(result);
            case 404:
                return NotFound(result);
            case 500:
                return StatusCode(500, result);
            default:
            {
                if (!result.Success)
                {
                    return BadRequest(result);
                }

                break;
            }
        }

        if (Guid.TryParse(command.MessageId, out var messageId))
        {
            var chatRoom = await _chatRoomRepository.FindByMessageIdAsync(messageId);
            if (chatRoom.IsSuccess)
            {
                await _chatRoomHubContext.Clients.Group(chatRoom.Value.ChatRoomId.ToString())
                    .SendAsync("UpdateMessage", result.MessageReaction.MessageId);
            }
        }

        return Created("", result);
    }
}
