using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Animo.Application;

public static class ApplicationServiceRegistrationDi
{
    public static void AddApplicationServices(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
    }
}
