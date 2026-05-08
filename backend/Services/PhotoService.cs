using Microsoft.EntityFrameworkCore;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Exceptions;
using SoccerDreamFermana.Backend.Models;

namespace SoccerDreamFermana.Backend.Services;

public sealed class PhotoService(AppDbContext db)
{
    private const string PhotoNotFoundMessage = "Foto non trovata";

    public async Task<PhotoResponse> CreateAsync(PhotoRequest request, CancellationToken cancellationToken)
    {
        var photo = new Photo();
        ApplyRequest(photo, request);
        db.Photos.Add(photo);
        await db.SaveChangesAsync(cancellationToken);
        return ToResponse(photo);
    }

    public async Task<IReadOnlyList<PhotoResponse>> ListAsync(CancellationToken cancellationToken)
    {
        var photos = await db.Photos
            .AsNoTracking()
            .OrderByDescending(photo => photo.CreatedAt)
            .ToListAsync(cancellationToken);

        return photos.Select(ToResponse).ToList();
    }

    public async Task<PhotoResponse> GetByIdAsync(long id, CancellationToken cancellationToken)
    {
        return ToResponse(await GetEntityByIdAsync(id, cancellationToken));
    }

    public async Task<PhotoResponse> UpdateAsync(long id, PhotoRequest request, CancellationToken cancellationToken)
    {
        var photo = await GetEntityByIdAsync(id, cancellationToken);
        ApplyRequest(photo, request);
        await db.SaveChangesAsync(cancellationToken);
        return ToResponse(photo);
    }

    public async Task DeleteAsync(long id, CancellationToken cancellationToken)
    {
        db.Photos.Remove(await GetEntityByIdAsync(id, cancellationToken));
        await db.SaveChangesAsync(cancellationToken);
    }

    private async Task<Photo> GetEntityByIdAsync(long id, CancellationToken cancellationToken)
    {
        return await db.Photos.FindAsync(new object?[] { id }, cancellationToken)
            ?? throw new ResourceNotFoundException(PhotoNotFoundMessage);
    }

    private static void ApplyRequest(Photo photo, PhotoRequest request)
    {
        photo.Titolo = TextNormalizer.NormalizeRequired(request.Titolo);
        photo.Descrizione = TextNormalizer.NormalizeOptional(request.Descrizione);
        photo.Immagine = TextNormalizer.NormalizeRequired(request.Immagine);
    }

    private static PhotoResponse ToResponse(Photo photo)
    {
        return new PhotoResponse(photo.Id, photo.Titolo, photo.Descrizione, photo.Immagine, photo.CreatedAt);
    }
}
