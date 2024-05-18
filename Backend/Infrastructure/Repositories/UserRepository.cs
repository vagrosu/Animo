using Animo.Application.Persistence;
using Animo.Domain.Common;
using Animo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserRepository(AnimoContext context) : BaseRepository<User>(context), IUserRepository
{
    public virtual async Task<Result<User>> FindByEmailAsync(string email)
    {
        var result = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        return result == null ? Result<User>.Failure($"Entity with email {email} not found") : Result<User>.Success(result);
    }

    public async Task<Result<User>> FindByPhoneNumberAsync(string phoneNumber)
    {
        var result = await _context.Users.FirstOrDefaultAsync(x => x.PhoneNumber == phoneNumber);
        return result == null ? Result<User>.Failure($"Entity with phone number {phoneNumber} not found") : Result<User>.Success(result);
    }

    public async Task<Result<User>> FindByUsernameAsync(string username)
    {
        var result = await _context.Users.FirstOrDefaultAsync(x => x.UserName == username);
        return result == null ? Result<User>.Failure($"Entity with username {username} not found") : Result<User>.Success(result);
    }

    public async Task<Result<IReadOnlyList<User>>> FindByChatRoomIdAsync(Guid chatRoomId)
    {
        var result = await _context.Users
            .Where(user => user.ChatRoomMembers.Any(chatRoomMember => chatRoomMember.ChatRoomId == chatRoomId))
            .ToListAsync();

        return Result<IReadOnlyList<User>>.Success(result);
    }
}