using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Security;
using SoccerDreamFermana.Backend.Services;

namespace SoccerDreamFermana.Backend.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    [AllowAnonymous]
    public Task<AuthResponse> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        return authService.RegisterAsync(request, cancellationToken);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public Task<AuthResponse> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        return authService.LoginAsync(request, cancellationToken);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<UserResponse> Me(CancellationToken cancellationToken)
    {
        return AuthService.ToUserResponse(await authService.FindByIdAsync(User.GetUserId(), cancellationToken));
    }
}
