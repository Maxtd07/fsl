using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Security;

public sealed class JwtTokenService(IConfiguration configuration)
{
    private readonly SigningCredentials _signingCredentials = new(
        BuildSigningKey(ConfigurationReader.Get(configuration, "APP_JWT_SECRET", "Jwt:Secret")),
        SecurityAlgorithms.HmacSha256
    );

    private readonly long _expirationMs = long.TryParse(
        ConfigurationReader.Get(configuration, "APP_JWT_EXPIRATION_MS", "Jwt:ExpirationMs"),
        out var expiration
    )
        ? expiration
        : 86_400_000;

    public string GenerateToken(User user)
    {
        var now = DateTime.UtcNow;
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Email),
            new("userId", user.Id.ToString()),
            new("nome", user.Nome),
            new("role", user.Ruolo.ToString())
        };

        var token = new JwtSecurityToken(
            claims: claims,
            notBefore: now,
            expires: now.AddMilliseconds(_expirationMs),
            signingCredentials: _signingCredentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static SymmetricSecurityKey BuildSigningKey(string? secret)
    {
        if (string.IsNullOrWhiteSpace(secret))
        {
            throw new InvalidOperationException(
                "APP_JWT_SECRET non configurato. Imposta una secret JWT di almeno 32 byte (256 bit)."
            );
        }

        var trimmedSecret = secret.Trim();
        var keyBytes = TryDecodeBase64(trimmedSecret, out var decoded) && decoded.Length >= 32
            ? decoded
            : Encoding.UTF8.GetBytes(trimmedSecret);

        if (keyBytes.Length < 32)
        {
            throw new InvalidOperationException(
                "APP_JWT_SECRET non valido. Usa una secret di almeno 32 byte oppure una stringa Base64 equivalente."
            );
        }

        return new SymmetricSecurityKey(keyBytes);
    }

    private static bool TryDecodeBase64(string value, out byte[] bytes)
    {
        try
        {
            bytes = Convert.FromBase64String(value);
            return true;
        }
        catch (FormatException)
        {
            bytes = [];
            return false;
        }
    }
}
