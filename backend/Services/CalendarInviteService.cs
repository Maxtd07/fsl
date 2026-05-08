using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Services;

public sealed partial class CalendarInviteService
{
    private static readonly TimeZoneInfo EventZone = ResolveRomeTimeZone();
    private static readonly CultureInfo ItalianCulture = CultureInfo.GetCultureInfo("it-IT");

    public byte[] BuildEventInvite(Event item)
    {
        var endDate = item.DataFine ?? item.Data.AddHours(2);
        var ics = string.Join("\r\n",
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Associazione Disabili//Eventi//IT",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            $"UID:event-{item.Id}@soccerdreamfermana.local",
            $"DTSTAMP:{ToUtc(DateTime.Now)}",
            $"DTSTART:{ToUtc(item.Data)}",
            $"DTEND:{ToUtc(endDate)}",
            $"SUMMARY:{Escape(item.Titolo)}",
            $"DESCRIPTION:{Escape(item.Descrizione)}",
            $"LOCATION:{Escape(item.Luogo)}",
            "END:VEVENT",
            "END:VCALENDAR",
            ""
        );

        return Encoding.UTF8.GetBytes(ics);
    }

    public string BuildFileName(Event item)
    {
        var slug = NonSlugRegex().Replace(item.Titolo.ToLower(ItalianCulture), "-").Trim('-');
        return $"{(string.IsNullOrWhiteSpace(slug) ? "evento" : slug)}.ics";
    }

    private static string ToUtc(DateTime dateTime)
    {
        var unspecified = DateTime.SpecifyKind(dateTime, DateTimeKind.Unspecified);
        var utc = TimeZoneInfo.ConvertTimeToUtc(unspecified, EventZone);
        return utc.ToString("yyyyMMdd'T'HHmmss'Z'", CultureInfo.InvariantCulture);
    }

    private static string Escape(string? value)
    {
        return (value ?? "")
            .Replace("\\", "\\\\", StringComparison.Ordinal)
            .Replace(",", "\\,", StringComparison.Ordinal)
            .Replace(";", "\\;", StringComparison.Ordinal)
            .Replace("\n", "\\n", StringComparison.Ordinal);
    }

    private static TimeZoneInfo ResolveRomeTimeZone()
    {
        try
        {
            return TimeZoneInfo.FindSystemTimeZoneById("Europe/Rome");
        }
        catch (TimeZoneNotFoundException)
        {
            return TimeZoneInfo.FindSystemTimeZoneById("W. Europe Standard Time");
        }
    }

    [GeneratedRegex("[^a-z0-9]+")]
    private static partial Regex NonSlugRegex();
}
