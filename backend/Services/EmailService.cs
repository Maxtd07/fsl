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
    private static readonly string[] MailFromKeys = ["APP_MAIL_FROM", "MAIL_FROM", "SMTP_FROM", "Mail:From"];
    private static readonly string[] ContactMailFromKeys =
    [
        "APP_MAIL_CONTACT_FROM",
        "APP_CONTACT_MAIL_FROM",
        "MAIL_CONTACT_FROM",
        "CONTACT_MAIL_FROM",
        "Mail:ContactFrom"
    ];
    private static readonly string[] ContactRecipientKeys =
    [
        "APP_MAIL_CONTACT_TO",
        "MAIL_CONTACT_TO",
        "CONTACT_MAIL_TO",
        "Mail:ContactTo"
    ];
    private static readonly string[] MailHostKeys = ["MAIL_HOST", "SMTP_HOST", "Mail:Host"];
    private static readonly string[] MailPortKeys = ["MAIL_PORT", "SMTP_PORT", "Mail:Port"];
    private static readonly string[] MailUsernameKeys = ["MAIL_USERNAME", "SMTP_USERNAME", "Mail:Username"];
    private static readonly string[] MailPasswordKeys =
    [
        "MAIL_PASSWORD",
        "APP_MAIL_PASSWORD",
        "SMTP_PASSWORD",
        "Mail:Password"
    ];
    private static readonly string[] MailAuthKeys = ["MAIL_SMTP_AUTH", "SMTP_AUTH", "Mail:SmtpAuth"];
    private static readonly string[] StartTlsKeys =
    [
        "MAIL_SMTP_STARTTLS",
        "MAIL_SMTP_STARTTLS_ENABLE",
        "SMTP_STARTTLS",
        "SMTP_STARTTLS_ENABLE",
        "Mail:StartTls"
    ];
    private static readonly string[] SslKeys =
    [
        "MAIL_SMTP_SSL_ENABLE",
        "MAIL_SSL_ENABLE",
        "SMTP_SSL",
        "SMTP_SSL_ENABLE",
        "Mail:Ssl"
    ];

    private readonly string? _mailFrom = ConfigurationReader.GetAny(configuration, MailFromKeys);
    private readonly string? _contactMailFrom = ConfigurationReader.GetAny(configuration, ContactMailFromKeys);
    private readonly string? _contactRecipient = ConfigurationReader.GetAny(configuration, ContactRecipientKeys);
    private readonly string? _mailHost = ConfigurationReader.GetAny(configuration, MailHostKeys);
    private readonly int _mailPort = int.TryParse(ConfigurationReader.GetAny(configuration, MailPortKeys), out var port)
        ? port
        : 587;
    private readonly string? _mailUsername = ConfigurationReader.GetAny(configuration, MailUsernameKeys);
    private readonly string? _mailPassword = ConfigurationReader.GetAny(configuration, MailPasswordKeys);
    private readonly bool _mailAuth = bool.TryParse(ConfigurationReader.GetAny(configuration, MailAuthKeys), out var auth)
        ? auth
        : true;
    private readonly bool _startTls = bool.TryParse(ConfigurationReader.GetAny(configuration, StartTlsKeys), out var startTls)
        ? startTls
        : true;
    private readonly bool _ssl = bool.TryParse(ConfigurationReader.GetAny(configuration, SslKeys), out var ssl)
        && ssl;

    public async Task<ContactEmailResult> SendContactEmailAsync(ContactRequest request, CancellationToken cancellationToken)
    {
        if (!IsMailConfigured())
        {
            logger.LogInformation(
                "SMTP non configurato. Messaggio contatti ricevuto da {Name} <{Email}>: {Message}",
                request.Nome,
                request.Email,
                request.Messaggio
            );
            return ContactEmailResult.NotConfigured;
        }

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(ResolveContactSender()));
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

        return await SendAsync(message, cancellationToken)
            ? ContactEmailResult.Sent
            : ContactEmailResult.Failed;
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

    public async Task<bool> SendBookingReminderAsync(User user, Event item, CancellationToken cancellationToken)
    {
        if (!IsMailConfigured())
        {
            logger.LogInformation("SMTP non configurato. Promemoria evento non inviato a {Email}", user.Email);
            return false;
        }

        var builder = new BodyBuilder { HtmlBody = BuildReminderEmailBody(user, item) };
        builder.Attachments.Add(
            calendarInviteService.BuildFileName(item),
            calendarInviteService.BuildEventInvite(item),
            ContentType.Parse("text/calendar")
        );

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(_mailFrom!));
        message.To.Add(MailboxAddress.Parse(user.Email));
        message.Subject = "Promemoria evento: " + item.Titolo;
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
        return GetMissingConfiguration().Count == 0;
    }

    public object GetConfigurationStatus()
    {
        return new
        {
            configured = IsMailConfigured(),
            missing = GetMissingConfiguration(),
            host = string.IsNullOrWhiteSpace(_mailHost) ? null : _mailHost,
            port = _mailPort,
            from = string.IsNullOrWhiteSpace(_mailFrom) ? null : _mailFrom,
            contactFrom = string.IsNullOrWhiteSpace(_contactMailFrom) ? null : _contactMailFrom,
            contactTo = string.IsNullOrWhiteSpace(_contactRecipient) ? null : _contactRecipient,
            usernameConfigured = !string.IsNullOrWhiteSpace(_mailUsername),
            passwordConfigured = !string.IsNullOrWhiteSpace(_mailPassword),
            smtpAuth = _mailAuth,
            startTls = _startTls,
            ssl = _ssl
        };
    }

    private IReadOnlyList<string> GetMissingConfiguration()
    {
        var missing = new List<string>();

        if (string.IsNullOrWhiteSpace(_mailHost))
        {
            missing.Add(DescribeKeys(MailHostKeys));
        }

        if (string.IsNullOrWhiteSpace(_mailFrom))
        {
            missing.Add(DescribeKeys(MailFromKeys));
        }

        if (_mailPort <= 0)
        {
            missing.Add(DescribeKeys(MailPortKeys));
        }

        if (_mailAuth && string.IsNullOrWhiteSpace(_mailUsername))
        {
            missing.Add(DescribeKeys(MailUsernameKeys));
        }

        if (_mailAuth && string.IsNullOrWhiteSpace(_mailPassword))
        {
            missing.Add(DescribeKeys(MailPasswordKeys));
        }

        return missing;
    }

    private static string DescribeKeys(IEnumerable<string> keys)
    {
        return string.Join(" / ", keys);
    }

    private string ResolveContactRecipient()
    {
        return string.IsNullOrWhiteSpace(_contactRecipient) ? _mailFrom! : _contactRecipient;
    }

    private string ResolveContactSender()
    {
        if (!string.IsNullOrWhiteSpace(_contactMailFrom))
        {
            return _contactMailFrom;
        }

        return ResolveContactRecipient();
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

    private static string BuildReminderEmailBody(User user, Event item)
    {
        return $"""
        <html>
         <body style="font-family:Arial,sans-serif;color:#1f2933;line-height:1.6;">
          <h2>Ciao {user.Nome}, ti ricordiamo il prossimo appuntamento</h2>
          <p>Hai un'iscrizione attiva a questo evento di ASD Soccer Dream Fermana.</p>
          <p><strong>Evento:</strong> {item.Titolo}</p>
          <p><strong>Data:</strong> {item.Data}</p>
          <p><strong>Luogo:</strong> {item.Luogo}</p>
          <p><strong>Dettagli:</strong> {item.Descrizione}</p>
          <p>In allegato trovi di nuovo il file calendario <strong>.ics</strong>.</p>
         </body>
        </html>
        """;
    }
}

public enum ContactEmailResult
{
    Sent,
    NotConfigured,
    Failed
}
