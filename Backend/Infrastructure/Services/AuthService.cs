using Animo.Application.Contracts.Identity;
using Animo.Application.Models.Identity;
using Animo.Application.Persistence;
using Animo.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace Infrastructure.Services;

public class AuthService(UserManager<User> userManager, IUserRepository userRepository, IConfiguration configuration) : IAuthService
{
    public async Task<(int, string)> RegistrationAsync(RegistrationModel model)
    {
        var userByUsername = await userRepository.FindByUsernameAsync(model.UserName);
        if (userByUsername.IsSuccess)
            return (0, "Username already exists");

        var userByEmail = await userRepository.FindByEmailAsync(model.Email);
        if (userByEmail.IsSuccess)
            return (0, "Email already exists");

        var userByPhoneNumber = await userRepository.FindByPhoneNumberAsync(model.PhoneNumber);
        if (userByPhoneNumber.IsSuccess)
            return (0, "Phone number already exists");


        if (!IsPasswordValid(model.Password))
        {
            return (0, "Password is not valid! The password must have at least 7 characters and needs to include a capital letter, a symbol and a digit.");
        }

        var user = new User()
        {
            UserName = model.UserName,
            FirstName = model.FirstName,
            LastName = model.LastName,
            Email = model.Email,
            PhoneNumber = model.PhoneNumber,
            SecurityStamp = Guid.NewGuid().ToString()
        };
        var createUserResult = await userManager.CreateAsync(user, model.Password);

        return !createUserResult.Succeeded ? (0, string.Join(", ", createUserResult.Errors.Select(x => "Code " + x.Code + " Description" + x.Description))) : (1, "User created successfully");
    }

    public async Task<(int, string)> LoginAsync(LoginModel model)
    {
        var userByUsername = await userRepository.FindByUsernameAsync(model.Identifier);
        var userByEmail = await userRepository.FindByEmailAsync(model.Identifier);
        var userByPhoneNumber = await userRepository.FindByPhoneNumberAsync(model.Identifier);

        if (!userByEmail.IsSuccess && !userByPhoneNumber.IsSuccess && !userByUsername.IsSuccess)
        {
            return (0, "User not found");
        }

        var user = userByEmail.IsSuccess ? userByEmail.Value : (userByPhoneNumber.IsSuccess ? userByPhoneNumber.Value : userByUsername.Value);
        if (!await userManager.CheckPasswordAsync(user, model.Password))
        {
            return (0, "Invalid password");
        }

        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        var token = GenerateJwtToken(authClaims);

        return (1, token);
    }

    private string GenerateJwtToken(IEnumerable<Claim> claims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]!));
        var token = new JwtSecurityToken(
            issuer: configuration["JWT:ValidIssuer"],
            audience: configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(3),
            claims: claims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256Signature)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private bool IsPasswordValid(string password)
    {
        var passwordValidator = new PasswordValidator<User>();
        return passwordValidator.ValidateAsync(userManager, null, password).Result.Succeeded;
    }
}
