using Animo.Application.Contracts.Identity;
using Animo.Application.Features.Users.Queries.GetCurrentUser;
using Animo.Application.Models.Identity;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Animo.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class AuthenticationController(IAuthService authService, ILogger<AuthenticationController> logger) : ApiControllerBase
{
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login(LoginModel model)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage));
                return BadRequest(new { Message = "Invalid payload", Errors = errors });
            }

            var (status, message) = await authService.LoginAsync(model);
            if (status == 0)
            {
                return BadRequest(message);
            }

            return Ok(message);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(RegistrationModel model)
    {
        try
        {
            if(!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest(new { Message = "Invalid payload", Errors = errors });
            }

            var (status, message) = await authService.RegistrationAsync(model);
            if (status == 0)
            {
                return BadRequest(message);
            }

            return CreatedAtAction(nameof(Register), null);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }

    [HttpGet]
    [Route("current-user")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var query = new GetCurrentUserQuery();
        var response = await Mediator.Send(query);

        switch (response.StatusCode)
        {
            case 401:
                return Unauthorized(response);
            case 404:
                return NotFound(response);
            case 500:
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            default:
                if (!response.Success)
                {
                    return BadRequest(response);
                }

                break;
        }

        return Ok(response);
    }
}
