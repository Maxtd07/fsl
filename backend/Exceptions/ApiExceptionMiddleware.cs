using System.Net;
using SoccerDreamFermana.Backend.Dtos;

namespace SoccerDreamFermana.Backend.Exceptions;

public sealed class ApiExceptionMiddleware(RequestDelegate next, ILogger<ApiExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await WriteErrorAsync(context, ex);
        }
    }

    private async Task WriteErrorAsync(HttpContext context, Exception exception)
    {
        var (status, message) = exception switch
        {
            ResourceNotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            BadRequestException => (StatusCodes.Status400BadRequest, exception.Message),
            ForbiddenAccessException => (StatusCodes.Status403Forbidden, exception.Message),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Credenziali non valide"),
            _ => (StatusCodes.Status500InternalServerError, "Si e verificato un errore interno")
        };

        if (status == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Unhandled backend exception");
        }
        else
        {
            logger.LogWarning(exception, "Handled backend exception");
        }

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";

        var error = ((HttpStatusCode)status).ToString();
        var response = ApiErrorResponse.From(status, error, message, context.Request.Path);
        await context.Response.WriteAsJsonAsync(response);
    }
}
