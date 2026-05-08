using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Services;

namespace SoccerDreamFermana.Backend.Controllers;

[ApiController]
[Route("api/facebook")]
public sealed class FacebookController(FacebookService facebookService) : ControllerBase
{
    [HttpGet("posts")]
    [AllowAnonymous]
    public Task<IReadOnlyList<FacebookPostResponse>> GetFacebookPosts(CancellationToken cancellationToken)
    {
        return facebookService.GetFacebookPostsAsync(cancellationToken);
    }
}
