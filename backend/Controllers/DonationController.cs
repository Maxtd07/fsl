using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Services;

namespace SoccerDreamFermana.Backend.Controllers;

[ApiController]
[Route("api/donations")]
public sealed class DonationController(DonationService donationService) : ControllerBase
{
    [HttpPost("create-payment")]
    [AllowAnonymous]
    public Task<CreatePaymentResponse> CreatePayment(CreatePaymentRequest request, CancellationToken cancellationToken)
    {
        return donationService.CreatePaymentAsync(request, cancellationToken);
    }

    [HttpPost("capture-payment")]
    [AllowAnonymous]
    public Task<CapturePaymentResponse> CapturePayment(CapturePaymentRequest request, CancellationToken cancellationToken)
    {
        return donationService.CapturePaymentAsync(request.OrderId, cancellationToken);
    }

    [HttpPost]
    [AllowAnonymous]
    public Task<DonationResponse> Create(DonationRequest request, CancellationToken cancellationToken)
    {
        return donationService.CreateAsync(request, cancellationToken);
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public Task<IReadOnlyList<DonationResponse>> List(CancellationToken cancellationToken)
    {
        return donationService.ListAsync(cancellationToken);
    }

    [HttpGet("{id:long}")]
    [Authorize(Roles = "ADMIN")]
    public Task<DonationResponse> GetById(long id, CancellationToken cancellationToken)
    {
        return donationService.GetByIdAsync(id, cancellationToken);
    }

    [HttpDelete("{id:long}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await donationService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}
