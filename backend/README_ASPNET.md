# ASP.NET Backend

Backend ASP.NET Core 8 che mantiene gli endpoint `/api/...` usati dal frontend React.

## Avvio

```powershell
# dalla root del repository
Copy-Item .env.example .env
cd backend
dotnet restore
dotnet run
```

`dotnet run` usa il profilo locale `Development` e ascolta su `http://localhost:8080`.

Il servizio ascolta su `http://localhost:8080` anche quando viene eseguito via Docker, oppure sulla porta indicata da `PORT` in ambienti come Render.
Come il vecchio backend Java, carica anche `.env` dalla root del progetto e da `backend/.env`.

Se avvii l'app senza launch profile, oppure in Docker/hosting, `APP_JWT_SECRET` deve essere impostata esplicitamente: in produzione non esiste un fallback sicuro.

## Variabili ambiente principali

- `APP_DB_URL`: JDBC URL MySQL compatibile con la vecchia configurazione, per esempio `jdbc:mysql://localhost:3306/soccerdreamfermana?useSSL=false`.
- `DB_USERNAME`, `DB_PASSWORD`: credenziali database.
- `APP_JWT_SECRET`: secret JWT di almeno 32 byte.
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: admin seed creato se non esiste.
- `ALLOWED_ORIGINS`: origini frontend separate da virgola.
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_BASE_URL`, `PAYPAL_CURRENCY`.
- `FACEBOOK_PAGE_ID`, `FACEBOOK_ACCESS_TOKEN`.
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `APP_MAIL_FROM`, `APP_MAIL_CONTACT_TO`.

## Deploy Docker

```powershell
docker build -t soccerdream-backend ./backend
docker run --env-file ./.env -p 8080:8080 soccerdream-backend
```

Health check: `GET /health`.
