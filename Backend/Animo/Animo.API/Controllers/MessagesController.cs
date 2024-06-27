using Animo.Application.Features.MessageReactions.Commands.CreateOrUpdateMessageReaction;
using Animo.Application.Features.MessageReactions.Commands.DeleteMessageReaction;
using Animo.Application.Features.Messages.Commands.CreateMessage;
using Animo.Application.Features.Messages.Queries.GetMessageById;
using Animo.Application.Features.Messages.Queries.GetTextMessageByChatRoomId;
using Animo.Application.Hubs;
using Animo.Application.Persistence;
using Animo.Domain.Common;
using Animo.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Animo.Controllers;

public class MessagesController(
    IHubContext<ChatRoomHub> chatRoomHubContext,
    IHubContext<ChatRoomsListHub> chatRoomsListHubContext,
    IChatRoomRepository chatRoomRepository,
    ITextMessageRepository textMessageRepository,
    IUserRepository userRepository) : ApiControllerBase
{
    private readonly IHubContext<ChatRoomHub> _chatRoomHubContext = chatRoomHubContext;
    private readonly IHubContext<ChatRoomsListHub> _chatRoomsListHubContext = chatRoomsListHubContext;
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ITextMessageRepository _textMessageRepository = textMessageRepository;

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

    [HttpPut("reactions")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Create(CreateOrUpdateMessageReactionCommand command)
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

    [HttpDelete("reactions/{messageReactionId}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(string messageReactionId)
    {
        string? chatRoomId = null;
        string? messageId = null;
        if (Guid.TryParse(messageReactionId, out var messageReactionGuid))
        {
            var message = await _textMessageRepository.FindByMessageReactionIdAsync(messageReactionGuid);
            if (message.IsSuccess)
            {
                var chatRoom = await _chatRoomRepository.FindByMessageIdAsync(message.Value.MessageId);
                if (chatRoom.IsSuccess)
                {
                    chatRoomId = chatRoom.Value.ChatRoomId.ToString();
                    messageId = message.Value.MessageId.ToString();
                }
            }
        }

        var command = new DeleteMessageReactionCommand { MessageReactionId = messageReactionId };
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

        if (chatRoomId != null && messageId != null)
        {
            await _chatRoomHubContext.Clients.Group(chatRoomId)
                .SendAsync("UpdateMessage", messageId);
        }

        return Ok(result);
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
