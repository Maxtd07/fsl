namespace SoccerDreamFermana.Backend.Dtos;

public sealed record ApiErrorResponse(
    DateTime Timestamp,
    int Status,
    string Error,
    string Message,
    string Path,
    IReadOnlyDictionary<string, string>? ValidationErrors
)
{
    public static ApiErrorResponse From(
        int status,
        string error,
        string message,
        PathString path,
        IReadOnlyDictionary<string, string>? validationErrors = null
    )
    {
        return new ApiErrorResponse(DateTime.Now, status, error, message, path.Value ?? "", validationErrors);
    }
}
