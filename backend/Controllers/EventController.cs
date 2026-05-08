using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Services;

namespace SoccerDreamFermana.Backend.Controllers;

[ApiController]
[Route("api/events")]
public sealed class EventController(EventService eventService, CalendarInviteService calendarInviteService) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public Task<EventResponse> Create(EventRequest request, CancellationToken cancellationToken)
    {
        return eventService.CreateAsync(request, cancellationToken);
    }

    [HttpGet]
    [AllowAnonymous]
    public Task<IReadOnlyList<EventResponse>> List([FromQuery] string? tipo, CancellationToken cancellationToken)
    {
        return eventService.ListAsync(tipo, cancellationToken);
    }

    [HttpGet("filter")]
    [AllowAnonymous]
    public Task<IReadOnlyList<EventResponse>> GetEventsByDateRange(
        [FromQuery] DateTime start,
        [FromQuery] DateTime end,
        [FromQuery] string? tipo,
        CancellationToken cancellationToken
    )
    {
        return eventService.GetEventsByDateRangeAsync(start, end, tipo, cancellationToken);
    }

    [HttpGet("upcoming")]
    [AllowAnonymous]
    public Task<IReadOnlyList<EventResponse>> GetUpcomingEvents(
        [FromQuery] DateTime? from,
        [FromQuery] string? tipo,
        CancellationToken cancellationToken
    )
    {
        return eventService.GetUpcomingEventsAsync(from ?? DateTime.Now, tipo, cancellationToken);
    }

    [HttpGet("{id:long}")]
    [AllowAnonymous]
    public Task<EventResponse> GetById(long id, CancellationToken cancellationToken)
    {
        return eventService.GetByIdAsync(id, cancellationToken);
    }

    [HttpPut("{id:long}")]
    [Authorize(Roles = "ADMIN")]
    public Task<EventResponse> Update(long id, EventRequest request, CancellationToken cancellationToken)
    {
        return eventService.UpdateAsync(id, request, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await eventService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpGet("{id:long}/calendar")]
    [AllowAnonymous]
    public async Task<IActionResult> DownloadCalendar(long id, CancellationToken cancellationToken)
    {
        var item = await eventService.GetEntityByIdAsync(id, cancellationToken);
        return File(
            calendarInviteService.BuildEventInvite(item),
            "text/calendar",
            calendarInviteService.BuildFileName(item)
        );
    }
}
