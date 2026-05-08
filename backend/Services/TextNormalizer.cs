using System.Text.RegularExpressions;
using SoccerDreamFermana.Backend.Exceptions;

namespace SoccerDreamFermana.Backend.Services;

public static partial class TextNormalizer
{
    private const string RequiredFieldMissingMessage = "Valore obbligatorio mancante";

    public static string NormalizeRequired(string? value)
    {
        return NormalizeOptional(value) ?? throw new BadRequestException(RequiredFieldMissingMessage);
    }

    public static string? NormalizeOptional(string? value)
    {
        if (value is null)
        {
            return null;
        }

        var normalized = WhitespaceRegex().Replace(value.Trim(), " ");
        return string.IsNullOrWhiteSpace(normalized) ? null : normalized;
    }

    public static string NormalizeEmail(string value)
    {
        return NormalizeRequired(value).ToLowerInvariant();
    }

    [GeneratedRegex(@"\s+")]
    private static partial Regex WhitespaceRegex();
}
