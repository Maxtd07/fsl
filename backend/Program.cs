using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SoccerDreamFermana.Backend.Data;
using SoccerDreamFermana.Backend.Dtos;
using SoccerDreamFermana.Backend.Exceptions;
using SoccerDreamFermana.Backend.Payments;
using SoccerDreamFermana.Backend.Security;
using SoccerDreamFermana.Backend.Services;

LoadEnvFrom(Directory.GetCurrentDirectory());
LoadEnvFrom(Path.Combine(Directory.GetCurrentDirectory(), ".."));
LoadEnvFrom(AppContext.BaseDirectory);
LoadEnvFrom(Path.Combine(AppContext.BaseDirectory, ".."));
LoadEnvFrom(Path.Combine(Directory.GetCurrentDirectory(), "backend"));

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var validationErrors = context.ModelState
            .Where(entry => entry.Value?.Errors.Count > 0)
            .ToDictionary(
                entry => ToCamelCase(entry.Key.Split('.').Last()),
                entry => entry.Value!.Errors.First().ErrorMessage
            );

        return new BadRequestObjectResult(ApiErrorResponse.From(
            StatusCodes.Status400BadRequest,
            "Bad Request",
            "Controlla i dati inviati",
            context.HttpContext.Request.Path,
            validationErrors
        ));
    };
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = DatabaseConnectionFactory.Build(builder.Configuration);
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 33)),
        mysql => mysql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(8), null)
    );
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        var origins = ConfigurationReader.GetCsv(
            builder.Configuration,
            "ALLOWED_ORIGINS",
            "Cors:AllowedOrigins"
        );

        if (origins.Count == 0)
        {
            policy.AllowAnyOrigin();
        }
        else
        {
            policy.WithOrigins(origins.ToArray());
        }

        policy.AllowAnyHeader().AllowAnyMethod();
    });
});

var jwtKey = JwtTokenService.BuildSigningKey(
    ConfigurationReader.Get(builder.Configuration, "APP_JWT_SECRET", "Jwt:Secret")
);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = jwtKey,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2),
            NameClaimType = "sub",
            RoleClaimType = "role"
        };
        options.Events = new JwtBearerEvents
        {
            OnChallenge = async context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(ApiErrorResponse.From(
                    StatusCodes.Status401Unauthorized,
                    "Unauthorized",
                    "Credenziali non valide",
                    context.HttpContext.Request.Path
                ));
            },
            OnForbidden = async context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(ApiErrorResponse.From(
                    StatusCodes.Status403Forbidden,
                    "Forbidden",
                    "Non hai i permessi necessari",
                    context.HttpContext.Request.Path
                ));
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddHttpClient();
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<EventService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<MemberService>();
builder.Services.AddScoped<PhotoService>();
builder.Services.AddScoped<DonationService>();
builder.Services.AddScoped<CalendarInviteService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<FacebookService>();
builder.Services.AddScoped<IPaymentAdapter, PayPalAdapter>();
builder.Services.AddHostedService<BookingReminderWorker>();

var app = builder.Build();

app.UseMiddleware<ApiExceptionMiddleware>();
app.UseCors("Frontend");

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/health", () => Results.Ok(new { status = "ok" })).AllowAnonymous();
app.MapControllers();
app.MapFallbackToFile("index.html");

using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.EnsureCreatedAsync();
    }
    catch (Exception ex) when (app.Environment.IsDevelopment())
    {
        app.Logger.LogWarning(ex, "Database unavailable during development startup. API endpoints that do not require the database will remain available.");
    }
}

await app.RunAsync();

static string ToCamelCase(string value)
{
    return string.IsNullOrWhiteSpace(value)
        ? value
        : char.ToLowerInvariant(value[0]) + value[1..];
}

static void LoadEnvFrom(string directory)
{
    var path = Path.Combine(directory, ".env");
    if (!File.Exists(path))
    {
        return;
    }

    foreach (var rawLine in File.ReadLines(path))
    {
        var line = rawLine.Trim();
        if (line.Length == 0 || line.StartsWith('#'))
        {
            continue;
        }

        var separatorIndex = line.IndexOf('=');
        if (separatorIndex <= 0)
        {
            continue;
        }

        var key = line[..separatorIndex].Trim();
        var value = line[(separatorIndex + 1)..].Trim().Trim('"');
        if (!string.IsNullOrWhiteSpace(key))
        {
            Environment.SetEnvironmentVariable(key, value);
        }
    }
}
