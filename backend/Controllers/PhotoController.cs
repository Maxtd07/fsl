using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Services;

namespace SoccerDreamFermana.Backend.Controllers;

[ApiController]
[Route("api/photos")]
public sealed class PhotoController(PhotoService photoService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create(PhotoRequest request, CancellationToken cancellationToken)
    {
        var response = await photoService.CreateAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpGet]
    [AllowAnonymous]
    public Task<IReadOnlyList<PhotoResponse>> List(CancellationToken cancellationToken)
    {
        return photoService.ListAsync(cancellationToken);
    }

    [HttpGet("{id:long}")]
    [AllowAnonymous]
    public Task<PhotoResponse> GetById(long id, CancellationToken cancellationToken)
    {
        return photoService.GetByIdAsync(id, cancellationToken);
    }

    [HttpPut("{id:long}")]
    [Authorize(Roles = "ADMIN")]
    public Task<PhotoResponse> Update(long id, PhotoRequest request, CancellationToken cancellationToken)
    {
        return photoService.UpdateAsync(id, request, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await photoService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
