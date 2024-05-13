using Animo.Application.Contracts.Identity;
using Animo.Application.Models.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Animo.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class AuthenticationController(IAuthService authService, ILogger<AuthenticationController> logger) : ControllerBase
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

            return CreatedAtAction(nameof(Register), model);
        }
        catch (Exception e)
        {
            logger.LogError(e.Message);
            return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
        }
    }
}