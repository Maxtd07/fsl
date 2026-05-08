using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Security;
using SoccerDreamFermana.Backend.Services;

namespace SoccerDreamFermana.Backend.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize(Roles = "USER,ADMIN")]
public sealed class BookingController(BookingService bookingService) : ControllerBase
{
    [HttpPost]
    public Task<BookingResponse> Create(BookingRequest request, CancellationToken cancellationToken)
    {
        return bookingService.CreateAsync(request.EventId, User.GetUserId(), cancellationToken);
    }

    [HttpGet("my")]
    public Task<IReadOnlyList<BookingResponse>> GetMyBookings(CancellationToken cancellationToken)
    {
        return bookingService.GetByUserAsync(User.GetUserId(), cancellationToken);
    }

    [HttpGet("event/{eventId:long}")]
    public Task<IReadOnlyList<BookingResponse>> GetByEvent(long eventId, CancellationToken cancellationToken)
    {
        return bookingService.GetByEventAsync(eventId, cancellationToken);
    }

    [HttpGet("user/{userId:long}")]
    public Task<IReadOnlyList<BookingResponse>> GetByUser(long userId, CancellationToken cancellationToken)
    {
        return bookingService.GetByUserAsync(userId, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await bookingService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
