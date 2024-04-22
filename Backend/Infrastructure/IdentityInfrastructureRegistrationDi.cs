using Animo.Application.Contracts.Identity;
using Animo.Application.Persistence;
using Animo.Domain.Entities;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
        
        services.AddIdentity<User, IdentityRole<Guid>>()
            .AddEntityFrameworkStores<AnimoContext>()
            .AddDefaultTokenProviders();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }

}
