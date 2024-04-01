using Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddIdentityInfrastructureToDI(builder.Configuration);

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.Run();
