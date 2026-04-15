import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { createBooking, fetchEvents, fetchMyBookings, getEventCalendarLink } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const eventDateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatEventMeta(event) {
  const meta = []

  if (event?.data) {
    const date = new Date(event.data)
    if (!Number.isNaN(date.getTime())) {
      meta.push(eventDateFormatter.format(date))
    }
  }

  if (event?.luogo) {
    meta.push(event.luogo)
  }

  return meta.join(' | ')
}

function EventModal({
  event,
  isOpen,
  onClose,
  onBooking,
  isBooking,
  isAuthenticated,
  isAlreadyBooked,
  bookingMessage,
}) {
  if (!isOpen || !event) return null

  const isFull = event.availableSeats <= 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:p-8">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl font-bold text-text/60 transition hover:text-text"
        >
          x
        </button>

        {event.volantino ? (
          <img src={event.volantino} alt={event.titolo} className="mb-6 h-64 w-full rounded-xl object-cover" />
        ) : (
          <PlaceholderImage alt={event.titolo} className="mb-6 h-64 w-full rounded-xl" />
        )}

        <h2 className="mb-2 text-3xl font-bold text-text md:text-4xl">{event.titolo}</h2>
        <p className="mb-4 text-sm text-text/60">{formatEventMeta(event)}</p>
        <p className="mb-6 text-base leading-7 text-text/85">{event.descrizione}</p>

        {/* Meta info */}
        <p className="text-sm text-text/60 mb-4">
          📅 {formatEventMeta(event)}
        </p>

        {/* Description */}
        <p className="text-text/85 mb-6 leading-7">{event.descrizione}</p>

        {/* Available seats */}
        <div className="mb-6 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">

          <p className="text-sm font-medium text-text">
            Iscritti: {event.registeredParticipants} / {event.maxPartecipanti}
          </p>
          <p className="mt-1 text-sm font-medium text-text">
            {isFull ? 'Evento al completo.' : `Posti disponibili: ${event.availableSeats}`}
          </p>
        </div>

        {bookingMessage && (
          <div className="mb-4 rounded-lg border border-secondary/25 bg-secondary/10 px-4 py-3 text-sm font-medium text-text">
            {bookingMessage}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onBooking}
            disabled={isFull || isBooking || isAlreadyBooked}
            className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 disabled:opacity-50"
          >
            {isAlreadyBooked
              ? 'Sei gia iscritto'
              : isBooking
                ? 'Iscrizione in corso...'
                : isAuthenticated
                  ? 'Iscriviti all evento'
                  : 'Accedi per iscriverti'}
          </button>

          <a
            href={getEventCalendarLink(event.id)}
            className="rounded-full border-2 border-primary/20 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition"
          >
            Scarica calendario
          </a>
        </div>
      </div>
    </div>
  )
}

function EventiPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [events, setEvents] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    let active = true

    async function loadEvents() {
      try {
        const data = await fetchEvents()
        if (!active) return
        setEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        setError(err.message || 'Impossibile caricare gli eventi dal backend.')
        setEvents([])
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadEvents()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadBookings() {
      if (!isAuthenticated) {
        setMyBookings([])
        return
      }

      try {
        const bookings = await fetchMyBookings()
        if (active) {
          setMyBookings(Array.isArray(bookings) ? bookings : [])
        }
      } catch {
        if (active) {
          setMyBookings([])
        }
      }
    }

    loadBookings()
    return () => {
      active = false
    }
  }, [isAuthenticated])

  const bookedEventIds = useMemo(() => new Set(myBookings.map((booking) => booking.eventId)), [myBookings])

  const openModal = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
    setBookingMessage('')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    setBookingMessage('')
  }

  const handleBooking = async () => {
    if (!selectedEvent) return

    if (!isAuthenticated) {
      navigate('/accedi', { state: { from: '/eventi' } })
      return
    }

    if (bookedEventIds.has(selectedEvent.id)) {
      setBookingMessage('Risulti gia iscritto a questo evento.')
      return
    }

    setIsBooking(true)
    setBookingMessage('')

    try {
      const booking = await createBooking(selectedEvent.id)

      setMyBookings((current) => [booking, ...current])
      setEvents((current) =>
        current.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                registeredParticipants: event.registeredParticipants + 1,
                availableSeats: Math.max(0, event.availableSeats - 1),
              }
            : event
        )
      )
      setSelectedEvent((current) =>
        current
          ? {
              ...current,
              registeredParticipants: current.registeredParticipants + 1,
              availableSeats: Math.max(0, current.availableSeats - 1),
            }
          : current
      )
      setBookingMessage(
        booking.emailSent
          ? 'Iscrizione completata. Controlla la tua email per il promemoria e il file calendario.'
          : 'Iscrizione salvata. In questo ambiente l email potrebbe non essere configurata: puoi scaricare il calendario dal pulsante dedicato.'
      )
    } catch (err) {
      setBookingMessage(err.message || 'Errore durante l iscrizione all evento.')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <main>
      <PageHero
        eyebrow="Eventi"
        title="Partecipa alle attivita dell associazione e iscriviti con il tuo account."
        description="Gli eventi vengono caricati dal backend Spring Boot. Gli utenti autenticati possono iscriversi, ricevere una conferma email e aggiungere l appuntamento al calendario."
        tone="primary"

        actions={
          <>
            <ActionLink to={isAuthenticated ? '/eventi' : '/accedi'}>{isAuthenticated ? 'La mia area' : 'Accedi ora'}</ActionLink>
            <ActionLink to="/contatti" variant="secondary">
              Chiedi informazioni
            </ActionLink>
          </>
        }
      />

      {isAuthenticated && myBookings.length > 0 && (
        <section className="rounded-[2rem] border-2 border-secondary/30 bg-secondary/10 px-6 py-6 shadow-[0_10px_20px_rgba(0,0,0,0.06)]">
          <SectionHeading
            eyebrow="Le tue iscrizioni"
            title="Eventi gia prenotati."
            description="Qui trovi un riepilogo rapido delle tue partecipazioni confermate."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myBookings.map((booking) => (
              <article key={booking.id} className="rounded-[1.4rem] border border-secondary/30 bg-base p-4 shadow-[0_6px_14px_rgba(0,0,0,0.06)]">
                <p className="text-sm font-bold text-text">{booking.eventTitle}</p>
                <p className="mt-2 text-sm text-text/75">
                  {booking.eventDate ? eventDateFormatter.format(new Date(booking.eventDate)) : ''}
                </p>
                <p className="mt-1 text-sm text-text/75">{booking.location}</p>
                <a href={getEventCalendarLink(booking.eventId)} className="mt-4 inline-flex text-sm font-semibold text-primary">
                  Scarica .ics
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="border-primary/15 px-6 py-10 lg:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            title="I nostri eventi"
            description="Scopri e iscriviti ai nostri eventi dedicati a famiglie e persone con disabilità."
          />

          <ActionLink to="/privacy" variant="secondary">
            Privacy e dati
          </ActionLink>
        </div>

        {isLoading && (
          <div className="rounded-3xl border-2 border-primary/20 bg-base px-5 py-6 text-sm font-medium text-text/80">
            Caricamento eventi in corso...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-3xl border-2 border-accent/30 bg-accent/10 px-5 py-6 text-sm font-medium text-text">
            {error}
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="rounded-3xl border-2 border-primary/20 bg-base px-5 py-6 text-sm font-medium text-text/80">
            Nessun evento disponibile al momento.
          </div>
        )}

        {!isLoading && !error && events.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event) => {
              const alreadyBooked = bookedEventIds.has(event.id)

              return (
                <button
                  key={event.id}
                  onClick={() => openModal(event)}
                  className="cursor-pointer overflow-hidden rounded-[1.4rem] border-2 border-primary/20 bg-base text-left shadow-[0_6px_14px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
                >
                  {event.volantino ? (
                    <img src={event.volantino} alt={event.titolo} className="h-48 w-full object-cover" />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-primary/10">
                      <PlaceholderImage alt="Evento" className="h-full w-full" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {event.availableSeats} posti liberi
                      </span>
                      {alreadyBooked && (
                        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                          Iscritto
                        </span>
                      )}
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-text">{event.titolo}</h3>
                    <p className="mb-3 line-clamp-3 text-sm text-text/75">{event.descrizione}</p>
                    <p className="text-xs text-text/60">{formatEventMeta(event)}</p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
        onBooking={handleBooking}
        isBooking={isBooking}
        isAuthenticated={isAuthenticated}
        isAlreadyBooked={selectedEvent ? bookedEventIds.has(selectedEvent.id) : false}
        bookingMessage={bookingMessage}
      />
    </main>
  )
}

export default EventiPage
