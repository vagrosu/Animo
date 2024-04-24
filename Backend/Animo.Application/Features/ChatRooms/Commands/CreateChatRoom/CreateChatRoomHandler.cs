using Animo.Application.Features.Users;
using Animo.Application.Persistence;
using Animo.Domain.Entities;
using MediatR;

namespace Animo.Application.Features.ChatRooms.Commands.CreateChatRoom;

public class CreateChatRoomHandler(IChatRoomRepository chatRoomRepository, IUserRepository userRepository) : IRequestHandler<CreateChatRoomCommand, CreateChatRoomCommandResponse>
{
    private readonly IChatRoomRepository _chatRoomRepository = chatRoomRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<CreateChatRoomCommandResponse> Handle(CreateChatRoomCommand request, CancellationToken cancellationToken)
    {
        var validator = new CreateChatRoomCommandValidator();
        var validatorResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validatorResult.IsValid)
        {
            return new CreateChatRoomCommandResponse
            {
                Success = false,
                ValidationsErrors = validatorResult.Errors.Select(e => e.ErrorMessage).ToList()
            };
        }

        var members = new List<User>();
        foreach (var memberId in request.MemberIds!)
        {
            if (Guid.TryParse(memberId, out var memberGuid) == false)
            {
                return new CreateChatRoomCommandResponse
                {
                    Success = false,
                    ValidationsErrors = new List<string> { $"Invalid user id {memberId}." }
                };
            }

            var member = await _userRepository.FindByIdAsync(memberGuid);
            if (!member.IsSuccess)
            {
                return new CreateChatRoomCommandResponse
                {
                    Success = false,
                    ValidationsErrors = new List<string> { $"User with id {memberId} not found." }
                };
            }

            if (members.Find(m => m.Id == member.Value.Id) == null)
            {
                members.Add(member.Value);
            }
        }

        if (members.Count() < 2)
        {
            return new CreateChatRoomCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { "Chat room must have at least 2 distinct members." }
            };
        }

        var chatRoomName = request.Name ??= string.Join(", ", members.ConvertAll(m => m.FirstName));
        var chatRoom = ChatRoom.Create(chatRoomName, members);
        if (!chatRoom.IsSuccess)
        {
            return new CreateChatRoomCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { chatRoom.Error }
            };
        }

        var result = await _chatRoomRepository.AddAsync(chatRoom.Value);
        if (!result.IsSuccess)
        {
            return new CreateChatRoomCommandResponse
            {
                Success = false,
                ValidationsErrors = new List<string> { result.Error }
            };
        }

        return new CreateChatRoomCommandResponse
        {
            Success = true,
            ChatRoom = new CreateChatRoomDto
            {
                ChatRoomId = chatRoom.Value.ChatRoomId,
                Name = chatRoom.Value.Name,
                Members = members.Select(
                    m => new ChatRoomUserDto
                    {
                        UserId = m.Id,
                        FirstName = m.FirstName,
                        LastName = m.LastName,
                        UserName = m.UserName
                    }
                ).ToArray()
            }
        };
    }
}
