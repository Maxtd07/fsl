import { useEffect, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchEvents, getBookingsByEvent, createBooking } from '../lib/api.js'

const eventDateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatEventMeta(event) {
  const meta = []
  try {
    if (event?.data) {
      const date = new Date(event.data)
      if (!isNaN(date.getTime())) {
        meta.push(eventDateFormatter.format(date))
      }
    }
    if (event?.luogo) {
      meta.push(event.luogo)
    }
  } catch {
    // fail silently
  }
  return meta.join(' | ')
}

/* Event Detail Modal */
function EventModal({ event, isOpen, onClose, bookingsCount, maxParticipants, onBooking, isBooking }) {
  if (!isOpen || !event) return null

  const availableSeats = (maxParticipants || 100) - (bookingsCount || 0)
  const isFull = availableSeats <= 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-w-2xl w-full rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-text/60 hover:text-text transition"
        >
          ✕
        </button>

        {/* Volantino Image */}
        {event.volantino && (
          <img
            src={event.volantino}
            alt={event.titolo}
            className="w-full h-64 object-cover rounded-xl mb-6"
          />
        )}

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">{event.titolo}</h2>

        {/* Meta info */}
        <p className="text-sm text-text/60 mb-4">
          📅 {formatEventMeta(event)}
        </p>

        {/* Description */}
        <p className="text-base text-text/85 mb-6 leading-7">{event.descrizione}</p>

        {/* Available seats */}
        <div className="mb-6 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-text">
            {isFull ? (
              <span className="text-accent">❌ Evento al completo</span>
            ) : (
              <span className="text-primary">✅ Posti disponibili: {availableSeats}</span>
            )}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBooking}
            disabled={isFull || isBooking}
            className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(76,130,169,0.22)] transition duration-200 hover:bg-primary/92 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/18 disabled:opacity-50"
          >
            {isBooking ? 'Iscriviti in corso...' : isFull ? 'Completo' : '✅ Iscriviti'}
          </button>

          <button
            onClick={onClose}
            className="rounded-full border-2 border-primary/20 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------
   Page
----------------------------*/
function EventiPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingsCount, setBookingsCount] = useState(0)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        const data = await fetchEvents()
        if (!alive) return
        if (Array.isArray(data)) {
          setEvents(data)
        } else {
          setEvents([])
        }
      } catch (err) {
        if (!alive) return
        setError('Impossibile caricare gli eventi dal backend.')
        setEvents([])
      } finally {
        if (alive) setIsLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [])

  const openModal = async (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
    setBookingMessage('')

    try {
      const bookings = await getBookingsByEvent(event.id)
      setBookingsCount(bookings.length)
    } catch (err) {
      console.error('Errore caricamento prenotazioni:', err)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    setBookingMessage('')
  }

  const handleBooking = async () => {
    if (!selectedEvent) return
    setIsBooking(true)
    setBookingMessage('')

    try {
      // Usa user ID fittizia (dev mode) - dovrebbe provenire da auth
      const userId = 1
      await createBooking(selectedEvent.id, userId)
      setBookingMessage('✅ Ti sei iscritto con successo! Controlla la tua email.')
      setBookingsCount(bookingsCount + 1)
      setTimeout(() => closeModal(), 2000)
    } catch (err) {
      setBookingMessage(`❌ Errore: ${err.message}`)
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <main>
      {/* HERO */}
      <PageHero
        eyebrow="Eventi"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit ut labore."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        tone="primary"
        actions={
          <>
            <ActionLink to="/contatti">Prenota ora</ActionLink>
            <ActionLink to="/galleria" variant="secondary">
              Vedi la galleria
            </ActionLink>
          </>
        }
      />

      {/* EVENTS */}
      <section className="border-primary/15 px-6 py-10 lg:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Prossimi eventi"
            title="Eventi caricati direttamente dal backend."
            description="La lista arriva dall’endpoint /events."
          />

          <ActionLink to="/contatti" variant="secondary">
            Chiedi informazioni
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
            {events.map((event, index) => (
              <button
                key={event?.id ?? index}
                onClick={() => openModal(event)}
                className="overflow-hidden rounded-[1.4rem] border-2 border-primary/20 bg-base shadow-[0_6px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-105 text-left cursor-pointer"
              >
                {event.volantino && (
                  <img
                    src={event.volantino}
                    alt={event.titolo}
                    className="w-full h-48 object-cover"
                  />
                )}
                {!event.volantino && (
                  <div className="w-full h-48 bg-primary/10 flex items-center justify-center">
                    <PlaceholderImage alt="Placeholder" className="w-full h-full" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-text mb-1">{event.titolo}</h3>
                  <p className="text-sm text-text/75 mb-3 line-clamp-2">{event.descrizione}</p>
                  <p className="text-xs text-text/60">{formatEventMeta(event)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
        bookingsCount={bookingsCount}
        maxParticipants={selectedEvent?.maxPartecipanti}
        onBooking={handleBooking}
        isBooking={isBooking}
      />

      {/* Booking notification toast */}
      {bookingMessage && (
        <div className="fixed bottom-4 right-4 rounded-lg border-2 border-primary/20 bg-base px-6 py-4 shadow-lg z-40">
          <p className="text-sm font-medium text-text">{bookingMessage}</p>
        </div>
      )}
    </main>
  )
}

export default EventiPage