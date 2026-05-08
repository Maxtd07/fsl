using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Services;

namespace SoccerDreamFermana.Backend.Controllers;

[ApiController]
[Route("api/email")]
public sealed class EmailController(EmailService emailService) : ControllerBase
{
    [HttpPost("contatti")]
    [AllowAnonymous]
    public async Task<IActionResult> SendContactEmail(ContactRequest request, CancellationToken cancellationToken)
    {
        var delivered = await emailService.SendContactEmailAsync(request, cancellationToken);
        return Ok(new
        {
            success = true,
            delivered,
            message = delivered
                ? "Email inviata con successo. Ti contatteremo presto!"
                : "Richiesta ricevuta correttamente. L'invio email non e configurato in questo ambiente."
        });
    }
}
