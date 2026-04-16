# 📅 Sistema Completo di Gestione Eventi - Documentazione

## 🎯 Panoramica

Questo è un **sistema full-stack completo** per la gestione di eventi con calendario interattivo. Il frontend è sviluppato in **React + Tailwind CSS** e il backend in **Spring Boot** con database che utilizza **Hibernate**.

### Caratteristiche Principali

✅ **Calendario interattivo** - Visualizza eventi per giorno, settimana, mese
✅ **Gestione iscrizioni** - Utenti autenticati possono iscriversi agli eventi  
✅ **Email automat iche** - Conferma iscrizione con file .ics allegato
✅ **API REST** - Backend completo con endpoint filtri data/intervallo
✅ **Autenticazione** - Sistema login/registrazione con JWT
✅ **Privacy GDPR** - Banner consenso al primo accesso + pagina privacy completa
✅ **Responsive** - Funziona perfettamente su mobile, tablet, desktop
✅ **Performance** - Senza ricaricamenti pagina, aggiornamenti fluidi

---

## 🏗️ Architettura

### Backend (Spring Boot)

```
src/main/java/com/associazionedisabili/
├── config/              # Configurazioni (CORS, Security, Database)
├── controller/          
│   ├── EventController      (GET /events, POST /events, filtri)
│   ├── BookingController    (POST /bookings, DELETE, MY bookings)
│   └── AuthController       (Login, Register, Me)
├── service/
│   ├── EventService         (CRUD + filtri per data)
│   ├── BookingService       (Gestione iscrizioni + email)
│   ├── EmailService         (Invio email con ICS)
│   └── CalendarInviteService (Generazione file .ics)
├── model/
│   ├── Event
│   ├── Booking
│   ├── User
│   └── ...
├── dto/
│   ├── event/
│   │   ├── EventRequest
│   │   └── EventResponse
│   └── booking/
│       ├── BookingRequest
│       └── BookingResponse
└── repository/ (JPA Repositories)
```

### Frontend (React + Vite)

```
src/
├── components/
│   ├── Calendar.jsx          (Calendario interattivo)
│   ├── EventModal.jsx        (Dettagli evento + iscriz)
│   ├── PrivacyBanner.jsx     (Consenso privacy)
│   ├── Navbar.jsx            (Navigazione + menu)
│   └── ...
├── pages/
│   ├── EventiPage.jsx        (Pagina principale eventi)
│   ├── PrivacyPage.jsx       (Privacy policy)
│   ├── AuthPage.jsx          (Login/Signup)
│   └── ...
├── context/
│   └── AuthContext.jsx       (Gestione autenticazione globale)
├── lib/
│   └── api.js                (Funzioni API client)
└── App.jsx                   (Root + routing)
```

---

## 🚀 API REST Backend

### Endpoint Principali

#### Eventi

```http
GET /api/events
└─ Ottiene tutti gli eventi ordinati per data

GET /api/events/{id}
└─ Dettagli evento specifico

GET /api/events/filter?start=2026-04-01T00:00:00&end=2026-04-30T23:59:59
└─ Filtra eventi tra due date (ISO 8601)

GET /api/events/upcoming?from=2026-04-15T10:00:00
└─ Ottiene eventi dal timestamp in poi

POST /api/events
└─ Crea nuovo evento (Admin)

PUT /api/events/{id}
└─ Aggiorna evento (Admin)

DELETE /api/events/{id}
└─ Elimina evento (Admin)

GET /api/events/{id}/calendar
└─ Scarica file .ics dell'evento
```

#### Iscrizioni

```http
POST /api/bookings
Body: { "eventId": 123 }
└─ Iscriviti a un evento

GET /api/bookings/my
└─ Ottiene tue iscrizioni

GET /api/bookings/event/{eventId}
└─ Ottiene iscritti ad evento (Admin)

DELETE /api/bookings/{id}
└─ Cancella iscrizione
```

#### Autenticazione

```http
POST /api/auth/register
Body: { "email": "user@email.com", "password": "...", "nome": "..." }

POST /api/auth/login
Body: { "email": "user@email.com", "password": "..." }
└─ Ritorna: { "token": "...", "user": {...} }

GET /api/auth/me
└─ Dati utente attuale (richiede Bearer token)
```

---

## 💻 Componenti Frontend

### Calendar Component

```jsx
import { Calendar } from './components/Calendar'

<Calendar
  onDateSelected={(date) => console.log(date)}
  onEventClick={(event) => console.log(event)}
/>
```

**Funzionalità:**
- Toggle visualizzazione: Giorno / Settimana / Mese
- Carica automaticamente eventi dal backend
- Evidenzia giorni con eventi
- Mostra preview eventi (titolo + numero)
- Click su giorno = lista dettagliata
- Click su evento = apre modal dettagli

### EventModal Component

```jsx
import { EventModal } from './components/EventModal'

<EventModal
  event={selectedEvent}
  isOpen={isOpen}
  onClose={() => setOpen(false)}
  onBookingChange={() => console.log('Iscrizione avvenuta')}
/>
```

**Funzionalità:**
- Visualizza dettagli evento completi
- Mostra posti disponibili con barra progresso
- Pulsante iscriviti/cancella iscrizione
- Scarica file .ics
- Messagi di errore/successo
- Richiede autenticazione per iscriversi

### PrivacyBanner Component  

```jsx
import { PrivacyBanner } from './components/PrivacyBanner'

<PrivacyBanner />
```

**Funzionalità:**
- Appare automaticamente al primo accesso
- Salva preferenza su localStorage
- Link alla pagina privacy completa
- Pulsanti Accetto / Rifiuto
- GDPR compliant

---

## 🔐 Flusso Autenticazione

1. **Registrazione**: Utente compila form → POST /auth/register → Token salvato
2. **Login**: Email + password → POST /auth/login → Token salvato in localStorage
3. **Persistenza sessione**: Al caricamento, verifica token → GET /auth/me
4. **Header Authorization**: Tutte le richieste autenticate includono `Authorization: Bearer {token}`

---

## 📧 Sistema Email

Quando un utente si iscrive a un evento:

1. Backend riceve richiesta POST /bookings
2. Verifica se utente e evento esistono
3. Controlla disponibilità posti
4. Salva booking su database
5. **Genera file .ics** con CalendarInviteService
6. **Invia email HTML** con:
   - Titolo evento
   - Data/ora/luogo
   - Descrizione
   - **Allegato .ics** (compatibile con Google Calendar, Apple Calendar, Outlook)
7. Ritorna response con flag `emailSent`

**Configurazione SMTP** in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
app.mail.from=noreply@associazionedisabili.it
```

---

## 🛡️ Privacy & GDPR

### Banner Consenso
- Appare automaticamente al primo accesso
- Memorizza scelta su localStorage con timestamp
- Non disturba più se già accettato/rifiutato

### Informativa Privacy  
Pagina completa che descrive:
- ✅ Titolare del trattamento
- ✅ Dati raccolti (nome, email, dati booking, pagamenti)
- ✅ Finalità trattamento
- ✅ Base giuridica (GDPR Art. 6)
- ✅ Conservazione dati
- ✅ Misure di sicurezza (JWT, hashing, TLS)
- ✅ Diritti utente (accesso, rettifica, cancellazione, opposizione)
- ✅ Cookie e tecnologie simili
- ✅ Contatti titolare

---

## 📱 Responsiveness

- **Mobile** (< 640px): Stack verticale, menu hamburger, full-width
- **Tablet** (640px - 1024px): 2 colonne, navbar ottimizzata
- **Desktop** (> 1024px): 3 colonne, layout completo

Tutti i componenti usano **Tailwind CSS** con classi responsive.

---

## 🧪 Testing

### Test API Backend
```bash
# Test GET all events
curl http://localhost:8080/api/events

# Test filtro data
curl "http://localhost:8080/api/events/filter?start=2026-04-01T00:00:00&end=2026-04-30T23:59:59"

# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass"}'

# Test iscrizione (con token)
curl -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventId":1}'
```

### Test Frontend
- Verificare calendario carica eventi
- Click su data → mostra eventi giornata
- Click su evento → apre modal
- Pulsante iscriviti → if non auth → redirect login
- Se auth → invia richiesta, mostra messaggi, refresh booking list
- Scarica .ics → file si salva localmente

---

## 🔄 Flusso Completo Iscrizione

```
┌─────────────┐
│ Utente      │
│ HomePage    │
└──────┬──────┘
       │ Clicca "Scopri Eventi"
       ▼
┌──────────────────┐
│ EventiPage       │
│ Calendario       │ ◄─────┐
└──────┬───────────┘       │
       │ Clicca su data    │
       ▼                   │
┌──────────────────┐       │
│ Lista eventi     │       │
│ del giorno       │       │
└──────┬───────────┘       │
       │ Clicca evento     │
       ▼                   │
┌──────────────────┐       │
│ EventModal       │       │
│ Dettagli evento  │       │
└──────┬───────────┘       │
       │ [Iscriviti]       │
       │ Se NOT auth →     │
       │   Redirect login  │
       │ Se auth →         │
       ▼ POST /bookings    │
┌──────────────────┐       │
│ Backend verifica │       │
│ Posti disponibili│       │
│ → Salva booking  │       │
│ → Invia email .ics       │
└──────┬───────────┘       │
       │ Success message   │
       └─────────────────► │
         "Iscritto!        │
          Controlla email" │
         Ricarica list ────┘
```

---

## 📚 Struttura Dati

### Event
```javascript
{
  id: 1,
  titolo: "Incontro famiglie",
  descrizione: "Descrizione evento...",
  data: "2026-04-20T10:00:00",
  dataFine: "2026-04-20T12:00:00",
  luogo: "Sala comunale",
  maxPartecipanti: 50,
  registeredParticipants: 23,
  availableSeats: 27,
  volantino: "url_to_image"
}
```

### Booking
```javascript
{
  id: 1,
  eventId: 1,
  eventTitle: "Incontro famiglie",
  userId: 5,
  userName: "Mario",
  userEmail: "mario@email.com",
  eventDate: "2026-04-20T10:00:00",
  location: "Sala comunale",
  createdAt: "2026-04-10T15:30:00",
  emailSent: true,
  calendarLink: "/api/events/1/calendar"
}
```

### User (Auth)
```javascript
{
  id: 1,
  email: "user@email.com",
  nome: "Mario Rossi",
  ruolo: "USER", // o "ADMIN"
  createdAt: "2026-01-01T00:00:00"
}
```

---

## ⚙️ Setup & Deploy

### Backend
```bash
cd backend
mvn clean package
java -jar target/backend-1.0.0.jar
```

### Frontend  
```bash
cd frontend
npm install
npm run dev        # Sviluppo
npm run build      # Produzione
```

---

## 📋 Checklist Completamento

- ✅ Backend API REST con filtri data
- ✅ CRUD Booking con email/ICS
- ✅ Frontend Calendar con React
- ✅ EventModal dettagli + iscrizione
- ✅ EventiPage integrata
- ✅ Privacy Banner GDPR
- ✅ Privacy Page completa
- ✅ Navbar moderna + responsive
- ✅ Email automat iche con allegato
- ✅ Autenticazione JWT
- ✅ UI without page reload
- ✅ Mobile responsive

---

## 🎨 Paletta Colori (Tailwind)

- **primary**: Blu principale (nav, CTA)
- **secondary**: Verde (disponibilità, successo)
- **accent**: Rosso/orange (warning, full)
- **base**: Bianco/grigio leggero (background)
- **text**: Scuro (testo principale)

---

## 📞 Supporto

Per domande o problemi:
1. Verifica i log backend: `tail -f spring-boot.log`
2. Apri DevTools browser (F12) per errori frontend
3. Controlla CORS se errori richieste API
4. Verifica SMTP configurazione se email non arrivano

---

**Ultima modifica**: Aprile 2026  
**Status**: ✅ Produzione Ready
