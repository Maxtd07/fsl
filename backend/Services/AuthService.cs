using Microsoft.EntityFrameworkCore;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Exceptions;
using SoccerDreamFermana.Backend.Models;
using SoccerDreamFermana.Backend.Security;

namespace SoccerDreamFermana.Backend.Services;

public sealed class AuthService(AppDbContext db, JwtTokenService jwtTokenService)
{
    private const string UserNotFoundMessage = "Utente non trovato";
    private const string DuplicateEmailMessage = "Esiste gia un utente registrato con questa email";

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = TextNormalizer.NormalizeEmail(request.Email);
        if (await db.Users.AnyAsync(user => user.Email == normalizedEmail, cancellationToken))
        {
            throw new BadRequestException(DuplicateEmailMessage);
        }

        var user = new User
        {
            Nome = TextNormalizer.NormalizeRequired(request.Nome),
            Email = normalizedEmail,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Ruolo = Role.USER
        };

        db.Users.Add(user);
        await db.SaveChangesAsync(cancellationToken);
        return BuildAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var email = TextNormalizer.NormalizeEmail(request.Email);
        var user = await db.Users.FirstOrDefaultAsync(item => item.Email == email, cancellationToken);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
        {
            throw new UnauthorizedAccessException();
        }

        return BuildAuthResponse(user);
    }

    public async Task<User> FindByIdAsync(long userId, CancellationToken cancellationToken)
    {
        return await db.Users.FindAsync(new object?[] { userId }, cancellationToken)
            ?? throw new BadRequestException(UserNotFoundMessage);
    }

    public static UserResponse ToUserResponse(User user)
    {
        return new UserResponse(user.Id, user.Nome, user.Email, user.Ruolo);
    }

    private AuthResponse BuildAuthResponse(User user)
    {
        return new AuthResponse(jwtTokenService.GenerateToken(user), ToUserResponse(user));
    }
}
