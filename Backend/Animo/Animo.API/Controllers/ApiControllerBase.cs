using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Animo.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class ApiControllerBase : ControllerBase
{
    private ISender _mediator = null!;

    protected ISender Mediator => _mediator
    ??= HttpContext.RequestServices
        .GetRequiredService<ISender>();
}
