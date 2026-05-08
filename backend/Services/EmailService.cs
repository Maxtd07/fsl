using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Services;

public sealed class EmailService(
    IConfiguration configuration,
    CalendarInviteService calendarInviteService,
    ILogger<EmailService> logger
)
{
    private readonly string? _mailFrom = ConfigurationReader.Get(configuration, "APP_MAIL_FROM", "Mail:From");
    private readonly string? _contactRecipient = ConfigurationReader.Get(configuration, "APP_MAIL_CONTACT_TO", "Mail:ContactTo");
    private readonly string? _mailHost = ConfigurationReader.Get(configuration, "MAIL_HOST", "Mail:Host");
    private readonly int _mailPort = int.TryParse(ConfigurationReader.Get(configuration, "MAIL_PORT", "Mail:Port"), out var port)
        ? port
        : 587;
    private readonly string? _mailUsername = ConfigurationReader.Get(configuration, "MAIL_USERNAME", "Mail:Username");
    private readonly string? _mailPassword = ConfigurationReader.Get(configuration, "MAIL_PASSWORD", "Mail:Password");
    private readonly bool _mailAuth = bool.TryParse(ConfigurationReader.Get(configuration, "MAIL_SMTP_AUTH", "Mail:SmtpAuth"), out var auth)
        ? auth
        : true;
    private readonly bool _startTls = bool.TryParse(ConfigurationReader.Get(configuration, "MAIL_SMTP_STARTTLS", "Mail:StartTls"), out var startTls)
        ? startTls
        : true;
    private readonly bool _ssl = bool.TryParse(ConfigurationReader.Get(configuration, "MAIL_SMTP_SSL_ENABLE", "Mail:Ssl"), out var ssl)
        && ssl;

    public async Task<bool> SendContactEmailAsync(ContactRequest request, CancellationToken cancellationToken)
    {
        if (!IsMailConfigured())
        {
            logger.LogInformation(
                "SMTP non configurato. Messaggio contatti ricevuto da {Name} <{Email}>: {Message}",
                request.Nome,
                request.Email,
                request.Messaggio
            );
            return false;
        }

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(_mailFrom!));
        message.To.Add(MailboxAddress.Parse(ResolveContactRecipient()));
        message.ReplyTo.Add(MailboxAddress.Parse(request.Email));
        message.Subject = "Nuovo messaggio dal sito - " + request.Nome;
        message.Body = new TextPart("plain")
        {
            Text = $"""
            Hai ricevuto un nuovo messaggio dal form contatti.

            Nome: {request.Nome}
            Email: {request.Email}

            Messaggio:
            {request.Messaggio}
            """
        };

        return await SendAsync(message, cancellationToken);
    }

    public async Task<bool> SendBookingConfirmationAsync(User user, Event item, CancellationToken cancellationToken)
    {
        if (!IsMailConfigured())
        {
            logger.LogInformation("SMTP non configurato. Conferma iscrizione non inviata a {Email}", user.Email);
            return false;
        }

        var builder = new BodyBuilder { HtmlBody = BuildBookingEmailBody(user, item) };
        builder.Attachments.Add(
            calendarInviteService.BuildFileName(item),
            calendarInviteService.BuildEventInvite(item),
            ContentType.Parse("text/calendar")
        );

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(_mailFrom!));
        message.To.Add(MailboxAddress.Parse(user.Email));
        message.Subject = "Iscrizione confermata: " + item.Titolo;
        message.Body = builder.ToMessageBody();

        return await SendAsync(message, cancellationToken);
    }

    private async Task<bool> SendAsync(MimeMessage message, CancellationToken cancellationToken)
    {
        try
        {
            var host = _mailHost ?? throw new InvalidOperationException("MAIL_HOST non configurato");
            using var client = new SmtpClient();
            var socketOptions = _ssl
                ? SecureSocketOptions.SslOnConnect
                : _startTls
                    ? SecureSocketOptions.StartTls
                    : SecureSocketOptions.Auto;

            await client.ConnectAsync(host, _mailPort, socketOptions, cancellationToken);
            if (_mailAuth)
            {
                var username = _mailUsername ?? throw new InvalidOperationException("MAIL_USERNAME non configurato");
                var password = _mailPassword ?? throw new InvalidOperationException("MAIL_PASSWORD non configurato");
                await client.AuthenticateAsync(username, password, cancellationToken);
            }

            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);
            return true;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Invio email non riuscito");
            return false;
        }
    }

    private bool IsMailConfigured()
    {
        if (string.IsNullOrWhiteSpace(_mailHost) || string.IsNullOrWhiteSpace(_mailFrom) || _mailPort <= 0)
        {
            return false;
        }

        return !_mailAuth || (!string.IsNullOrWhiteSpace(_mailUsername) && !string.IsNullOrWhiteSpace(_mailPassword));
    }

    private string ResolveContactRecipient()
    {
        return string.IsNullOrWhiteSpace(_contactRecipient) ? _mailFrom! : _contactRecipient;
    }

    private static string BuildBookingEmailBody(User user, Event item)
    {
        return $"""
        <html>
         <body style="font-family:Arial,sans-serif;color:#1f2933;line-height:1.6;">
          <h2>Ciao {user.Nome}, la tua iscrizione e confermata</h2>
          <p>Ti aspettiamo al prossimo evento dell'Associazione.</p>
          <p><strong>Evento:</strong> {item.Titolo}</p>
          <p><strong>Data:</strong> {item.Data}</p>
          <p><strong>Luogo:</strong> {item.Luogo}</p>
          <p><strong>Dettagli:</strong> {item.Descrizione}</p>
          <p>In allegato trovi il file calendario <strong>.ics</strong>, compatibile con Google Calendar, Apple Calendar e altri client.</p>
         </body>
        </html>
        """;
    }
}
