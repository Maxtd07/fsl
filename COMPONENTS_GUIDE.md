# Guida ai Componenti Frontend

## 📅 Calendar Component

**Path**: `src/components/Calendar.jsx`

### Props

| Prop | Tipo | Required | Descrizione |
|------|------|----------|-------------|
| `onDateSelected` | Function | ❌ | Callback quando si clicca su una data: `(date) => void` |
| `onEventClick` | Function | ❌ | Callback quando si clicca su un evento: `(event) => void` |

### Uso

```jsx
import { useState } from 'react'
import { Calendar } from '../components/Calendar'
import { EventModal } from '../components/EventModal'

export default function MyPage() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const handleDateSelected = (date) => {
    setSelectedDate(date)
    console.log(`Data selezionata: ${date.toLocaleDateString('it-IT')}`)
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  return (
    <>
      <Calendar
        onDateSelected={handleDateSelected}
        onEventClick={handleEventClick}
      />
      
      <EventModal
        event={selectedEvent}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
```

### Caratteristiche

- 📅 Visualizzazione mese con griglia 7x6
- 🎯 Evidenziazione giorni con eventi (colore secondario)
- 🔄 Toggle visualizzazione: Giorno / Settimana / Mese
- ⏪⏩ Navigazione mesi: Precedente / Oggi / Successivo
- 🔄 Caricamento automatico eventi dal backend per il mese
- 🎨 Preview eventi su ogni giorno (max 2, con "+n" se più)
- 💾 Selezione data → mostra lista dettagliata sotto

---

## 🔔 EventModal Component

**Path**: `src/components/EventModal.jsx`

### Props

| Prop | Tipo | Required | Descrizione |
|------|------|----------|-------------|
| `event` | Object | ✅ | L'evento da mostrare |
| `isOpen` | Boolean | ✅ | Se il modal è aperto |
| `onClose` | Function | ✅ | Callback chiusura modal |
| `onBookingChange` | Function | ❌ | Callback dopo iscrizione/cancellazione |

### Uso

```jsx
import { useState } from 'react'
import { EventModal } from '../components/EventModal'

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenEvent = (event) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }

  return (
    <EventModal
      event={selectedEvent}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onBookingChange={() => {
        // Ricarica dati se necessario
        console.log('Prenotazione aggiornata')
      }}
    />
  )
}
```

### Caratteristiche

- 📜 Visualizza dettagli evento completi
- 🎫 Mostra posti disponibili con barra progresso
- ✅ Pulsante "Iscrivimi" (if autenticato)
- ❌ Pulsante "Cancella iscrizione" (if già iscritto)
- ⬇️ Scarica file .ics
- 🔐 Se non autenticato → link login
- ⏳ Loading states durante le richieste
- 💬 Messaggi errore/successo in-modal

### Dati Evento

```javascript
{
  id: 1,
  titolo: "Incontro famiglia",
  descrizione: "Descrizione dettagliata...",
  data: "2026-04-20T10:00:00",
  dataFine: "2026-04-20T12:00:00",
  luogo: "Sala comunale, Via Roma 5",
  maxPartecipanti: 50,
  registeredParticipants: 23,
  availableSeats: 27,
  volantino: "http://example.com/image.jpg"
}
```

---

## 🔒 PrivacyBanner Component

**Path**: `src/components/PrivacyBanner.jsx` 

### Uso

In App.jsx:

```jsx
import { PrivacyBanner } from './components/PrivacyBanner'

function App() {
  return (
    <>
      <PrivacyBanner />
      {/* resto app */}
    </>
  )
}
```

### Behavior

1. ✅ Appare automaticamente **al primo accesso**
2. 💾 Salva preferenza su `localStorage` con chiave `privacy_consent_v1`
3. 🚫 Non appare più se già accettato/rifiutato
4. 🔗 Link alla pagina privacy completa
5. 🎨 Design modal con backdrop semi-trasparente
6. ✋ Pulsanti: "Rifiuta" (grigio) e "Accetto" (primario)

### Struttura localStorage

```javascript
localStorage.getItem('privacy_consent_v1')
// Ritorna: { accepted: true/false, date: "2026-04-15T10:30:00" }
```

### Personalizzazione

Per modificare il testo, editare il file:

```jsx
// Sezione da modificare in PrivacyBanner.jsx
<h2 className="text-lg font-bold text-text">Privacy e Cookie</h2>
<p className="mt-2 text-sm text-text/75">
  // MODIFICA QUI
  Utilizziamo i tuoi dati secondo il GDPR...
</p>
```

---

## API Client Functions

**Path**: `src/lib/api.js`

### Events

```javascript
import { fetchEvents, getEventById, getEventsByDateRange, getUpcomingEvents } from '../lib/api'

// Recupera tutti gli eventi
const allEvents = await fetchEvents()

// Ottieni evento specifico
const event = await getEventById(123)

// Filtra tra due date
const aprilEvents = await getEventsByDateRange(
  new Date('2026-04-01'),
  new Date('2026-04-30')
)

// Eventi futuri da una data
const upcoming = await getUpcomingEvents(new Date())
```

### Bookings

```javascript
import { createBooking, fetchMyBookings, deleteBooking, getEventCalendarLink } from '../lib/api'

// Iscriviti evento
const booking = await createBooking(eventId)

// Mie prenotazioni
const myBookings = await fetchMyBookings()

// Cancella prenotazione
await deleteBooking(bookingId)

// Link per scaricare .ics
const icsLink = getEventCalendarLink(eventId)
// Ritorna: "/api/events/123/calendar"
```

### Auth

```javascript
import { loginUser, registerUser, fetchCurrentUser } from '../lib/api'

// Registrati
const auth = await registerUser({
  email: 'email@test.com',
  password: 'password123',
  nome: 'Mario Rossi'
})
// Ritorna: { token: "...", user: {...} }

// Login
const auth = await loginUser({
  email: 'email@test.com',
  password: 'password123'
})

// Dati utente attuale
const user = await fetchCurrentUser()
```

---

## AuthContext

**Path**: `src/context/AuthContext.jsx`

### Uso

```jsx
import { useAuth } from '../context/AuthContext'

export default function MyComponent() {
  const { 
    user,              // Oggetto user corrente (null se not auth)
    isAuthenticated,   // Boolean
    isAdmin,           // Boolean
    isLoading,         // Boolean durante caricamento
    token,             // JWT token
    login,             // Funzione (credentials) => Promise
    register,          // Funzione (payload) => Promise
    logout,            // Funzione () => void
    refreshUser        // Funzione () => Promise
  } = useAuth()

  if (isLoading) return <div>Caricamento...</div>

  if (isAuthenticated) {
    return <div>Benvenuto {user.nome}!</div>
  }

  return <div>Non autenticato</div>
}
```

### Flusso Autenticazione

```
┌─ Initial load
│
├─ Controlla localStorage per token
│
├─ Se token presente:
│  └─ Passa ad API: GET /auth/me
│     ├─ Success → setUser, setToken, isLoading=false
│     └─ Error → logout, isLoading=false
│
└─ Se NO token:
   └─ isLoading=false, user=null
```

### Protezione Route

```jsx
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Caricamento...</div>
  if (!isAuthenticated) return <Navigate to="/accedi" />

  return children
}

// Uso
<Route 
  path="/mie-prenotazioni" 
  element={<PrivateRoute><MyBookingsPage /></PrivateRoute>}
/>
```

---

## Error Handling

Tutte le funzioni `apiFunc` lanciano errori se risposta non OK:

```javascript
try {
  const event = await getEventById(999)
} catch (error) {
  console.error(error.message) // "Evento non trovato"
  // Mostra messaggio utente...
}
```

La struttura errori da backend:

```javascript
// Se status >= 400
{
  message: "Descrizione errore",
  error: "Tipo errore",
  title: "Titolo"
}
```

---

## File .ics (Calendario)

Quando scarichi un evento:

```javascript
const link = getEventCalendarLink(eventId) // "/api/events/1/calendar"
// Clicca il link → browser scarica file "evento-name.ics"
```

Il file .ics è compatibile con:
- ✅ Google Calendar
- ✅ Apple Calendar
- ✅ Outlook
- ✅ Mozilla Thunderbird
- ✅ Praticamente qualsiasi client email/calendario

---

## Tailwind Classi Utili

### Colori

```jsx
// Primary (Blu)
<div className="text-primary">Testo blu</div>
<div className="bg-primary">Background blu</div>
<div className="border-primary">Bordo blu</div>

// Secondary (Verde)
<div className="text-secondary bg-secondary/10">Verde con background soft</div>

// Accent (Rosso/Warning)  
<div className="text-accent bg-accent/10">Messaggio warning</div>

// Opacity
<div className="text-text/50">Testo 50% opaco</div>
<div className="bg-primary/20">Background primary 20%</div>
```

### Responsive

```jsx
// Mobile first → tablet → desktop
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  1 colonna mobile, 2 tablet, 3 desktop
</div>
```

---

## Performance Tips

1. **Usare `useMemo` per calcoli pesanti**
   ```jsx
   const bookedIds = useMemo(() => 
     new Set(bookings.map(b => b.eventId)), 
     [bookings]
   )
   ```

2. **Lazy load images**
   ```jsx
   <img 
     src={url} 
     loading="lazy"
     alt="evento"
   />
   ```

3. **Debounce search**
   ```jsx
   const [search, setSearch] = useState('')
   const debouncedSearch = useDebouncedValue(search, 300)
   ```

4. **Cancella listeners al unmount**
   ```jsx
   useEffect(() => {
     return () => {
       // cleanup
     }
   }, [])
   ```

---

## Debug

**Abilitare console logging:**

```javascript
// In api.js
const DEBUG = true
async function apiRequest(...) {
  if (DEBUG) console.log('API Request:', path, options)
  // ...
  if (DEBUG) console.log('API Response:', data)
}
```

**Chrome DevTools:**
- F12 → Network → vedi richieste API
- F12 → Console → vedi errori JavaScript  
- F12 → Application → localStorage tokens

---

**Ultima modifica**: Aprile 2026
