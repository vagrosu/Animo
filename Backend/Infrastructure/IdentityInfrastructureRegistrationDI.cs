using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class IdentityInfrastructureRegistrationDI
{
    public static IServiceCollection AddIdentityInfrastructureToDI(
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

        return services;
    }

}
