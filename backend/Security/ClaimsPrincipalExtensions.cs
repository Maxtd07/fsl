using System.Security.Claims;
using SoccerDreamFermana.Backend.Exceptions;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Security;

public static class ClaimsPrincipalExtensions
{
    public static long GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue("userId");
        return long.TryParse(value, out var userId)
            ? userId
            : throw new UnauthorizedAccessException();
    }

    public static User ToUserSnapshot(this ClaimsPrincipal principal)
    {
        var id = principal.GetUserId();
        var email = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? principal.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException();
        var nome = principal.FindFirstValue("nome") ?? "";
        var roleText = principal.FindFirstValue("role") ?? Role.USER.ToString();

        if (!Enum.TryParse<Role>(roleText, out var role))
        {
            throw new BadRequestException("Ruolo utente non valido");
        }

        return new User
        {
            Id = id,
            Email = email,
            Nome = nome,
            Ruolo = role
        };
    }
}
