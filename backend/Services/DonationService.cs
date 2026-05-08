using Microsoft.EntityFrameworkCore;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Exceptions;
using SoccerDreamFermana.Backend.Models;
using SoccerDreamFermana.Backend.Payments;

namespace SoccerDreamFermana.Backend.Services;

public sealed class DonationService(AppDbContext db, IPaymentAdapter paymentAdapter)
{
    private const string DonationNotFoundMessage = "Donazione non trovata";
    private const string InvalidPaymentStatusMessage = "La donazione puo essere salvata solo dopo una cattura completata";
    private const string CompletedPaymentStatus = "COMPLETED";

    public Task<CreatePaymentResponse> CreatePaymentAsync(CreatePaymentRequest request, CancellationToken cancellationToken)
    {
        return paymentAdapter.CreatePaymentAsync(request, cancellationToken);
    }

    public Task<CapturePaymentResponse> CapturePaymentAsync(string orderId, CancellationToken cancellationToken)
    {
        return paymentAdapter.CapturePaymentAsync(orderId, cancellationToken);
    }

    public async Task<DonationResponse> CreateAsync(DonationRequest request, CancellationToken cancellationToken)
    {
        ValidatePaymentStatus(request.PaymentStatus);
        var donation = new Donation
        {
            Nome = TextNormalizer.NormalizeRequired(request.Nome),
            Email = TextNormalizer.NormalizeEmail(request.Email),
            Importo = request.Importo,
            PaypalOrderId = request.PaypalOrderId,
            PayerId = request.PayerId,
            CaptureId = request.CaptureId,
            PaymentStatus = string.IsNullOrWhiteSpace(request.PaymentStatus) ? CompletedPaymentStatus : request.PaymentStatus
        };

        db.Donations.Add(donation);
        await db.SaveChangesAsync(cancellationToken);
        return ToResponse(donation);
    }

    public async Task<IReadOnlyList<DonationResponse>> ListAsync(CancellationToken cancellationToken)
    {
        var donations = await db.Donations
            .AsNoTracking()
            .OrderByDescending(donation => donation.CreatedAt)
            .ToListAsync(cancellationToken);

        return donations.Select(ToResponse).ToList();
    }

    public async Task<DonationResponse> GetByIdAsync(long id, CancellationToken cancellationToken)
    {
        return ToResponse(await FindDonationByIdAsync(id, cancellationToken));
    }

    public async Task DeleteAsync(long id, CancellationToken cancellationToken)
    {
        db.Donations.Remove(await FindDonationByIdAsync(id, cancellationToken));
        await db.SaveChangesAsync(cancellationToken);
    }

    private static void ValidatePaymentStatus(string? paymentStatus)
    {
        if (paymentStatus is not null && !CompletedPaymentStatus.Equals(paymentStatus, StringComparison.OrdinalIgnoreCase))
        {
            throw new BadRequestException(InvalidPaymentStatusMessage);
        }
    }

    private async Task<Donation> FindDonationByIdAsync(long id, CancellationToken cancellationToken)
    {
        return await db.Donations.FindAsync(new object?[] { id }, cancellationToken)
            ?? throw new ResourceNotFoundException(DonationNotFoundMessage);
    }

    private static DonationResponse ToResponse(Donation donation)
    {
        return new DonationResponse(
            donation.Id,
            donation.Nome,
            donation.Email,
            donation.Importo,
            donation.PaypalOrderId,
            donation.PayerId,
            donation.CaptureId,
            donation.PaymentStatus,
            donation.CreatedAt
        );
    }
}
