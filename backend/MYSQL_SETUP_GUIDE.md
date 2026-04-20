# Migrazione Database da H2 a MySQL

## 📋 Overview

Il progetto supporta ora sia **H2** (development) che **MySQL** (production). La configurazione utilizza **Spring Profiles** per selezionare l'ambiente.

---

## 🚀 Setup Development (H2 - Default)

H2 è il database di default per lo sviluppo. Nessuna configurazione necessaria.

```bash
# Start backend con profile 'dev' (default)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# O semplicemente
mvn spring-boot:run
```

**H2 Console** disponibile a: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:file:./data/soccerdreamfermana;MODE=LEGACY;DB_CLOSE_ON_EXIT=FALSE`
- Username: `sa`
- Password: (vuota)

---

## 🔧 Setup Production (MySQL)

### 1️⃣ Installare MySQL

**Windows (Chocolatey)**:
```powershell
choco install mysql
```

**Windows (Manuale)**:
Scarica da https://dev.mysql.com/downloads/mysql/ e installa

**macOS**:
```bash
brew install mysql
```

**Linux (Ubuntu/Debian)**:
```bash
sudo apt-get install mysql-server
```

---

### 2️⃣ Creare il Database

```bash
# Accedi a MySQL
mysql -u root -p

# Esegui il comando:
source backend/src/main/resources/schema-mysql.sql;

# Oppure esegui i comandi SQL manualmente:
CREATE DATABASE IF NOT EXISTS soccerdreamfermana;
USE soccerdreamfermana;
-- (esegui il contenuto di schema-mysql.sql)
```

---

### 3️⃣ Configurare le Variabili di Ambiente

Crea un file `.env` nella root del progetto:

```env
# Database Configuration (prod profile)
DB_USERNAME=root
DB_PASSWORD=your_secure_password
APP_DB_URL=jdbc:mysql://localhost:3306/soccerdreamfermana?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# JWT Secret (production)
APP_JWT_SECRET=your_very_secure_jwt_secret_key_here_min_32_chars

# Frontend URLs
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
FRONTEND_BASE_URL=https://yourdomain.com

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_specific_password
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS=true

# PayPal (production)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_BASE_URL=https://api-m.paypal.com

# Facebook
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_ACCESS_TOKEN=your_access_token
```

---

### 4️⃣ Avviare il Backend con MySQL

```bash
# Con profilo 'prod'
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"

# Oppure compilare e eseguire JAR
mvn clean package
java -jar backend/target/backend-1.0.0.jar --spring.profiles.active=prod
```

---

## 🔄 Migrazione dei Dati

Se avevi dati in H2 e vuoi portarli a MySQL:

### Opzione 1: Export da H2 e Import in MySQL

```bash
# 1. Esporta da H2 (da H2 console)
SELECT * FROM users;
SELECT * FROM events;
-- etc.

# 2. Copia i dati in MySQL usando INSERT statements
```

### Opzione 2: Dump & Restore

```bash
# Dump H2 database
mysqldump -u root -p soccerdreamfermana > backup.sql

# Restore in MySQL
mysql -u root -p soccerdreamfermana < backup.sql
```

---

## 🐛 Troubleshooting

### Errore: "Communications link failure"
```
Soluzione:
- Verifica che MySQL sia in esecuzione: service mysql status
- Verifica la stringa di connessione in application-prod.properties
- Controlla firewall/permessi
```

### Errore: "Access denied for user 'root'@'localhost'"
```
Soluzione:
- Verifica le credenziali in .env
- Reset password MySQL: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html
```

### Errore: "Database doesn't exist"
```
Soluzione:
- Esegui schema-mysql.sql: mysql -u root -p < backend/src/main/resources/schema-mysql.sql
```

### Errore Hibernate "No dialect mapping"
```
Soluzione:
- Verifica che il driver MySQL sia installato (pom.xml)
- Verifica spring.jpa.properties.hibernate.dialect in application-prod.properties
```

---

## 📊 Verificare la Connessione

```bash
# Connetti direttamente a MySQL per verificare
mysql -u root -p soccerdreamfermana

# Esegui query di test
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM events;
```

---

## 🔐 Best Practices per Produzione

✅ **Sicurezza**:
- Cambiar password MySQL: `ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_secure_password';`
- Crea utente dedicato per l'app (non usare root)
- Abilita SSL per connessioni remote

✅ **Backup**:
```bash
# Backup automatico (cron job)
0 2 * * * mysqldump -u root -p soccerdreamfermana > /backups/db_$(date +\%Y\%m\%d).sql
```

✅ **Monitoring**:
- Monitora dimensione database: `SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb FROM information_schema.tables WHERE table_schema = 'soccerdreamfermana';`
- Ottimizza indici periodicamente
- Fai VACUUM/OPTIMIZE TABLE

✅ **Connection Pool**:
- HikariCP configurato in application-prod.properties
- Max connections: 10 (configurabile per carico)
- Idle timeout: 10 min

---

## 📝 Profili Disponibili

| Profilo | Database | DDL Mode | Logging | Uso |
|---------|----------|----------|---------|-----|
| **dev** | H2 | `update` | DEBUG | Development locale |
| **prod** | MySQL | `validate` | INFO | Production server |
| (default) | H2 | `update` | DEBUG | No profile specified |

---

## ⚡ Quick Start Commands

```bash
# Development (H2)
mvn clean spring-boot:run

# Production (MySQL)
mvn clean spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"

# Build JAR
mvn clean package

# Run JAR with MySQL
java -Dspring.profiles.active=prod -jar backend/target/backend-1.0.0.jar

# View MySQL logs
tail -f /var/log/mysql/mysql.log  # Linux
```

---

Per domande o problemi: contatta il team di sviluppo! 🚀
