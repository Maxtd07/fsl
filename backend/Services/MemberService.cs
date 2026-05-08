using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Exceptions;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Services;

public sealed partial class MemberService(AppDbContext db)
{
    private const string MemberNotFoundMessage = "Membro non trovato";
    private const string InvalidNameFormatMessage = "Il nome deve essere nel formato Cognome Nome";
    private const string InvalidPositionMessage = "La posizione selezionata non e valida";
    private const string DuplicateShirtNumberMessage = "Il numero di maglia e gia assegnato a un altro giocatore";
    private static readonly HashSet<string> AllowedPositions = ["attacker", "defender", "midfielder", "goalkeeper", "reserve"];

    public async Task<MemberResponse> CreateAsync(MemberRequest request, CancellationToken cancellationToken)
    {
        var member = new Member();
        await ApplyRequestAsync(member, request, cancellationToken);
        db.Members.Add(member);
        await db.SaveChangesAsync(cancellationToken);
        return ToResponse(member);
    }

    public async Task<IReadOnlyList<MemberResponse>> ListAsync(CancellationToken cancellationToken)
    {
        var members = await db.Members
            .AsNoTracking()
            .OrderBy(member => member.Name)
            .ToListAsync(cancellationToken);

        return members.Select(ToResponse).ToList();
    }

    public async Task<MemberResponse> GetByIdAsync(long id, CancellationToken cancellationToken)
    {
        return ToResponse(await GetEntityByIdAsync(id, cancellationToken));
    }

    public async Task<MemberResponse> UpdateAsync(long id, MemberRequest request, CancellationToken cancellationToken)
    {
        var member = await GetEntityByIdAsync(id, cancellationToken);
        await ApplyRequestAsync(member, request, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
        return ToResponse(member);
    }

    public async Task DeleteAsync(long id, CancellationToken cancellationToken)
    {
        db.Members.Remove(await GetEntityByIdAsync(id, cancellationToken));
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task<Member> GetEntityByIdAsync(long id, CancellationToken cancellationToken)
    {
        return await db.Members.FindAsync(new object?[] { id }, cancellationToken)
            ?? throw new ResourceNotFoundException(MemberNotFoundMessage);
    }

    private async Task ApplyRequestAsync(Member member, MemberRequest request, CancellationToken cancellationToken)
    {
        var normalizedName = NormalizeName(request.Name);
        var normalizedRole = TextNormalizer.NormalizeRequired(request.Role);
        var isPlayer = IsPlayerRole(normalizedRole);

        member.Name = normalizedName;
        member.Role = normalizedRole;
        member.Position = NormalizePosition(request.Position, isPlayer);
        member.ShirtNumber = isPlayer ? request.ShirtNumber : null;
        member.ImageUrl = TextNormalizer.NormalizeOptional(request.ImageUrl);

        await ValidateUniqueShirtNumberAsync(member, cancellationToken);
    }

    private async Task ValidateUniqueShirtNumberAsync(Member member, CancellationToken cancellationToken)
    {
        if (member.ShirtNumber is null)
        {
            return;
        }

        var alreadyAssigned = await db.Members.AnyAsync(
            item => item.ShirtNumber == member.ShirtNumber && item.Id != member.Id,
            cancellationToken
        );

        if (alreadyAssigned)
        {
            throw new BadRequestException(DuplicateShirtNumberMessage);
        }
    }

    private static string NormalizeName(string value)
    {
        var normalized = TextNormalizer.NormalizeRequired(value);
        return normalized.Contains(' ', StringComparison.Ordinal)
            ? normalized
            : throw new BadRequestException(InvalidNameFormatMessage);
    }

    private static string? NormalizePosition(string? value, bool isPlayer)
    {
        if (!isPlayer)
        {
            return null;
        }

        var normalized = TextNormalizer.NormalizeOptional(value)?.ToLowerInvariant();
        if (normalized is null)
        {
            return null;
        }

        return AllowedPositions.Contains(normalized)
            ? normalized
            : throw new BadRequestException(InvalidPositionMessage);
    }

    private static bool IsPlayerRole(string? role)
    {
        return role is not null && PlayerRoleRegex().IsMatch(role);
    }

    private static MemberResponse ToResponse(Member member)
    {
        return new MemberResponse(member.Id, member.Name, member.Role, member.Position, member.ShirtNumber, member.ImageUrl);
    }

    [GeneratedRegex(@"\bgiocatore\b", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant)]
    private static partial Regex PlayerRoleRegex();
}
