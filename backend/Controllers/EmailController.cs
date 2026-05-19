using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Services;

namespace SoccerDreamFermana.Backend.Controllers;

[ApiController]
[Route("api/email")]
public sealed class EmailController(EmailService emailService) : ControllerBase
{
    [HttpGet("status")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult GetStatus()
    {
        return Ok(emailService.GetConfigurationStatus());
    }

    [HttpPost("contatti")]
    [AllowAnonymous]
    public async Task<IActionResult> SendContactEmail(ContactRequest request, CancellationToken cancellationToken)
    {
        var result = await emailService.SendContactEmailAsync(request, cancellationToken);
        var delivered = result == ContactEmailResult.Sent;

        return Ok(new
        {
            success = true,
            delivered,
            message = result switch
            {
                ContactEmailResult.Sent => "Email inviata con successo. Ti contatteremo presto!",
                ContactEmailResult.NotConfigured => "Richiesta ricevuta correttamente. L'invio email non e configurato in questo ambiente.",
                _ => "Richiesta ricevuta correttamente, ma l'invio email non e riuscito. Riprova piu tardi."
            }
        });
    }
}
