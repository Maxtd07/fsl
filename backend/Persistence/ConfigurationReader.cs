namespace SoccerDreamFermana.Backend.Data;

public static class ConfigurationReader
{
    public static string? Get(IConfiguration configuration, string environmentName, string configurationKey)
    {
        return configuration[environmentName] ?? configuration[configurationKey];
    }

    public static string? GetAny(IConfiguration configuration, params string[] keys)
    {
        foreach (var key in keys)
        {
            var value = configuration[key];
            if (!string.IsNullOrWhiteSpace(value))
            {
                return value;
            }
        }

        return null;
    }

    public static string Get(
        IConfiguration configuration,
        string environmentName,
        string configurationKey,
        string fallback
    )
    {
        return Get(configuration, environmentName, configurationKey) ?? fallback;
    }

    public static IReadOnlyList<string> GetCsv(
        IConfiguration configuration,
        string environmentName,
        string configurationKey
    )
    {
        var value = Get(configuration, environmentName, configurationKey);
        if (string.IsNullOrWhiteSpace(value))
        {
            return Array.Empty<string>();
        }

        return value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }
}
