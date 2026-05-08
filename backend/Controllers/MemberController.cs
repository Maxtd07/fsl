using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Services;

namespace SoccerDreamFermana.Backend.Controllers;

[ApiController]
[Route("api/members")]
public sealed class MemberController(MemberService memberService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Create(MemberRequest request, CancellationToken cancellationToken)
    {
        var response = await memberService.CreateAsync(request, cancellationToken);
        return Created($"/api/members/{response.Id}", response);
    }

    [HttpGet]
    [AllowAnonymous]
    public Task<IReadOnlyList<MemberResponse>> List(CancellationToken cancellationToken)
    {
        return memberService.ListAsync(cancellationToken);
    }

    [HttpGet("{id:long}")]
    [AllowAnonymous]
    public Task<MemberResponse> GetById(long id, CancellationToken cancellationToken)
    {
        return memberService.GetByIdAsync(id, cancellationToken);
    }

    [HttpPut("{id:long}")]
    [Authorize(Roles = "ADMIN")]
    public Task<MemberResponse> Update(long id, MemberRequest request, CancellationToken cancellationToken)
    {
        return memberService.UpdateAsync(id, request, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await memberService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
