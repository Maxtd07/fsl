using SoccerDreamFermana.Backend.Dtos;

namespace SoccerDreamFermana.Backend.Payments;

public interface IPaymentAdapter
{
    Task<CreatePaymentResponse> CreatePaymentAsync(CreatePaymentRequest request, CancellationToken cancellationToken);
    Task<CapturePaymentResponse> CapturePaymentAsync(string orderId, CancellationToken cancellationToken);
}
