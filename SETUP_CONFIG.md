# 🚀 SETUP & CONFIGURAZIONE

## Backend Setup

### 1. Dipendenze Maven (pom.xml)

Il progetto ha già le principali:
- ✅ Spring Boot 3.3.0
- ✅ Spring Data JPA
- ✅ Spring Security + JWT (jjwt)
- ✅ Spring Mail
- ✅ Lombok
- ✅ H2 Database (per dev)

### 2. Configurazione Application Properties

**File**: `backend/src/main/resources/application.properties`

```properties
# Database H2
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Security JWT
security.jwt.secret=your-super-secret-key-min-32-chars-here!!!
security.jwt.expiration=86400000    # 24 hours
security.jwt.refreshExpiration=604800000  # 7 days

# CORS
application.cors.allowedOrigins=http://localhost:5173,http://localhost:3000
application.cors.allowedMethods=GET,POST,PUT,DELETE,OPTIONS
application.cors.allowedHeaders=*
application.cors.allowCredentials=true
application.cors.maxAge=3600

# Email SMTP (Gmail con App Password)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx  # App-specific password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
app.mail.from=noreply@associazionedisabili.it

# PayPal
paypal.client-id=YOUR_PAYPAL_CLIENT_ID
paypal.client-secret=YOUR_PAYPAL_SECRET
paypal.base-url=https://api.sandbox.paypal.com
paypal.currency=EUR

# Logging
logging.level.root=INFO
logging.level.com.associazionedisabili=DEBUG
```

### 3. Configurazione Development vs Production

**Development** (application-dev.properties):
```properties
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
logging.level.root=DEBUG
server.port=8080
```

**Production** (application-prod.properties):
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.datasource.url=jdbc:mysql://db-host:3306/associazionedisabili
spring.datasource.username=db_user
spring.datasource.password=db_password
logging.level.root=WARN
server.port=8080
```

### 4. Build e Esecuzione

```bash
cd backend

# Compilare
mvn clean package -DskipTests

# Eseguire in dev
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Eseguire JAR
java -Dspring.profiles.active=prod -jar target/backend-1.0.0.jar
```

---

## Frontend Setup

### 1. Install Dipendenze

```bash
cd frontend
npm install
```

### 2. Configurazione Vite

**File**: `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,  // true per debug in prod
  }
})
```

### 3. Variabili di Ambiente

**File**: `frontend/.env.local` (per development)

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Associazione Disabili
VITE_APP_VERSION=1.0.0
```

**File**: `frontend/.env.production` (per production)

```bash
VITE_API_BASE_URL=/api
VITE_APP_NAME=Associazione Disabili
VITE_APP_VERSION=1.0.0
```

### 4. Build e Development

```bash
# Development server (con hot reload)
npm run dev
# Accedi a: http://localhost:5173

# Build per production
npm run build
# Output: dist/

# Preview build locale
npm run preview

# Lint code
npm run lint
```

### 5. Tailwind Configuration

**File**: `frontend/tailwind.config.js` (già configurato)

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        base: 'var(--color-base)',
        text: 'var(--color-text)',
      }
    }
  }
}
```

---

## Docker Compose (Optional)

**File**: `docker-compose.yml` per dev completo

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: associazionedisabili
      MYSQL_USER: lacri
      MYSQL_PASSWORD: lacripass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mailhog:  # Email testing
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"
      - "8025:8025"  # UI a http://localhost:8025

  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/associazionedisabili
      SPRING_DATASOURCE_USERNAME: lacri
      SPRING_DATASOURCE_PASSWORD: lacripass
      SPRING_MAIL_HOST: mailhog
      SPRING_MAIL_PORT: 1025
    ports:
      - "8080:8080"
    depends_on:
      - mysql
      - mailhog

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_BASE_URL: http://localhost:8080/api
    depends_on:
      - backend

volumes:
  mysql_data:
```

Avvia con:
```bash
docker-compose up
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
# MailHog: http://localhost:8025
```

---

## Email Testing

### Opzione 1: Gmail (Produzione)

1. Abilita 2FA su account Gmail
2. Genera App Password: https://myaccount.google.com/apppasswords
3. Copia password (16 caratteri senza spazi)
4. In `application.properties`:
   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=xxxx xxxx xxxx xxxx
   ```

### Opzione 2: MailHog (Development)

1. Docker: `docker run -p 1025:1025 -p 8025:8025 mailhog/mailhog`
2. In `application.properties`:
   ```properties
   spring.mail.host=localhost
   spring.mail.port=1025
   spring.mail.username=
   spring.mail.password=
   ```
3. Visualizza email: http://localhost:8025

### Opzione 3: Mailtrap

1. Registrati su https://mailtrap.io
2. Copia credenziali SMTP
3. In `application.properties`:
   ```properties
   spring.mail.host=live.smtp.mailtrap.io
   spring.mail.port=465
   spring.mail.username=api
   spring.mail.password=YOUR_MAILTRAP_TOKEN
   ```

---

## Database Setup

### Development (H2)

Non richiede setup, incluso in pom.xml. Dati salvati in memoria.

### Production (MySQL)

```sql
-- Crea database
CREATE DATABASE associazionedisabili CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crea utente
CREATE USER 'lacri'@'localhost' IDENTIFIED BY 'lacripass';

-- Concedi permessi
GRANT ALL PRIVILEGES ON associazionedisabili.* TO 'lacri'@'localhost';
FLUSH PRIVILEGES;
```

Quindi in `application-prod.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/associazionedisabili
spring.datasource.username=lacri
spring.datasource.password=lacripass
spring.jpa.hibernate.ddl-auto=validate
```

---

## SSL/TLS (HTTPS)

### Generare Auto-Signed Certificate

```bash
keytool -genkeypair -alias tomcat \
  -keyalg RSA -keysize 2048 \
  -keystore /path/to/keystore.p12 \
  -keypass password \
  -storepass password
```

### Configurare in Spring Boot

```properties
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=password
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
```

### Redirect HTTP → HTTPS

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.requiresChannel()
            .anyRequest()
            .requiresSecure();
        return http.build();
    }
}
```

---

## Monitoraggio & Logging

### Actuator Endpoints

```properties
management.endpoints.web.exposure.include=health,info,metrics,prometheus
```

Accedi:
- http://localhost:8080/actuator/health
- http://localhost:8080/actuator/metrics
- http://localhost:8080/actuator/prometheus

### Log Configuration

**File**: `backend/src/main/resources/logback-spring.xml`

```xml
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <file>logs/application.log</file>
    <encoder>
      <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
    </encoder>
  </appender>

  <root level="INFO">
    <appender-ref ref="FILE" />
  </root>
</configuration>
```

---

## Deployment Checklist

- [ ] ✅ Backend: `mvn clean package -DskipTests`
- [ ] ✅ Frontend: `npm run build` → `dist/` creata
- [ ] ✅ Database: MySQL/PostgreSQL setup
- [ ] ✅ Email: SMTP configurato e testato
- [ ] ✅ JWT: secret key generato e salvato
- [ ] ✅ CORS: origine corretta in config
- [ ] ✅ SSL/TLS: certificato installato
- [ ] ✅ Env vars: settate in environment
- [ ] ✅ Backup plan: database backup automatizzato
- [ ] ✅ Monitoring: logging e health checks abilitati

---

## Troubleshooting

### CORS Error
```
Access to XMLHttpRequest at 'http://localhost:8080/api/events' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```
**Soluzione**: Verifica `application.cors.allowedOrigins` in `application.properties`

### 404 on /api/events
**Soluzione**: Verifica che EventController sia in package corretto e sia caricato da Spring Boot

### Email non inviata
```
Caused by: java.net.NoRouteToHostException
```
**Soluzione**: 
1. Verifica SMTP host/port
2. Controlla firewall/proxy
3. Se Gmail, verifica App Password generata

### Token JWT invalido  
```
JWT strings must contain exactly 2 period characters
```
**Soluzione**: Verifica che Authorization header sia `Bearer VALIDTOKEN`

### React dev server non si connette al backend
**Soluzione**: 
1. Accerta che backend è in esecuzione (`http://localhost:8080`)
2. Controlla proxy in `vite.config.js`
3. Testa curl: `curl http://localhost:8080/api/events`

---

**Pronto al deploy!** 🚀
