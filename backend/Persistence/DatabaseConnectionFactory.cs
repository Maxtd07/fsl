using System.Text.RegularExpressions;
using MySqlConnector;

namespace SoccerDreamFermana.Backend.Data;

public static class DatabaseConnectionFactory
{
    private static readonly Regex JdbcMySqlPattern = new(
        @"^jdbc:mysql://(?<host>[^:/?]+)(:(?<port>\d+))?/(?<database>[^?]+)",
        RegexOptions.Compiled | RegexOptions.IgnoreCase
    );

    public static string Build(IConfiguration configuration)
    {
        var explicitConnectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? configuration["APP_DB_CONNECTION_STRING"]
            ?? configuration["DATABASE_CONNECTION_STRING"];

        if (!string.IsNullOrWhiteSpace(explicitConnectionString))
        {
            return explicitConnectionString;
        }

        var jdbcUrl = configuration["APP_DB_URL"];
        if (!string.IsNullOrWhiteSpace(jdbcUrl))
        {
            return FromJdbcUrl(jdbcUrl, configuration);
        }

        var builder = new MySqlConnectionStringBuilder
        {
            Server = configuration["DB_HOST"] ?? "localhost",
            Port = uint.TryParse(configuration["DB_PORT"], out var port) ? port : 3306,
            Database = configuration["DB_NAME"] ?? "soccerdreamfermana",
            UserID = configuration["DB_USERNAME"] ?? "root",
            Password = configuration["DB_PASSWORD"] ?? "",
            SslMode = MySqlSslMode.Preferred,
            AllowPublicKeyRetrieval = true
        };

        return builder.ConnectionString;
    }

    private static string FromJdbcUrl(string jdbcUrl, IConfiguration configuration)
    {
        var match = JdbcMySqlPattern.Match(jdbcUrl);
        if (!match.Success)
        {
            throw new InvalidOperationException("APP_DB_URL deve essere una JDBC URL MySQL valida.");
        }

        var builder = new MySqlConnectionStringBuilder
        {
            Server = match.Groups["host"].Value,
            Port = match.Groups["port"].Success ? uint.Parse(match.Groups["port"].Value) : 3306,
            Database = Uri.UnescapeDataString(match.Groups["database"].Value),
            UserID = configuration["DB_USERNAME"] ?? "root",
            Password = configuration["DB_PASSWORD"] ?? "",
            SslMode = jdbcUrl.Contains("useSSL=true", StringComparison.OrdinalIgnoreCase)
                ? MySqlSslMode.Required
                : MySqlSslMode.Preferred,
            AllowPublicKeyRetrieval = true
        };

        return builder.ConnectionString;
    }
}
