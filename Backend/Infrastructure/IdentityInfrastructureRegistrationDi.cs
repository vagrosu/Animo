using Animo.Application.Contracts.Identity;
using Animo.Application.Persistence;
using Animo.Domain.Entities;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Infrastructure;

public static class IdentityInfrastructureRegistrationDi
{
    public static IServiceCollection AddIdentityInfrastructureToDi(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddDbContext<AnimoContext>(
            options => options.UseNpgsql(
                configuration.GetConnectionString("AnimoConnection"),
                builder => builder.MigrationsAssembly(
                    typeof(AnimoContext).Assembly.FullName
                )
            )
        );

        // Identity
        services.AddIdentity<User, IdentityRole<Guid>>()
            .AddEntityFrameworkStores<AnimoContext>()
            .AddDefaultTokenProviders();

        // Authentication
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = configuration["JWT:ValidAudience"],
                    ValidIssuer = configuration["JWT:ValidIssuer"],
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["JWT:Secret"])
                    )
                };
            });

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IChatRoomRepository, ChatRoomRepository>();
        services.AddScoped<ITextMessageRepository, TextMessageRepository>();
        services.AddScoped<IMessageEmotionRepository, MessageEmotionRepository>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        return services;
    }

}
