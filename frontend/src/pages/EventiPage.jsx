import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchEvents, fetchMyBookings, getEventCalendarLink } from '../lib/api.js'
import { useAuth } from '../context/useAuth.js'
import { Calendar } from '../components/Calendar.jsx'
import { EventModal as EventDetailsModal } from '../components/EventModal.jsx'

const eventDateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const viewModeOptions = [
  { value: 'calendar', label: 'Calendario' },
  { value: 'list', label: 'Lista' },
]

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

function getViewModeButtonClassName(isActive) {
  return `rounded-lg px-4 py-2 text-sm font-semibold ${
    isActive
      ? 'bg-primary/20 text-primary'
      : 'border border-primary/20 text-text/70 hover:bg-primary/10'
  }`
}

function EventiPage() {
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [myBookings, setMyBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('list')
  const requestedEventId = searchParams.get('eventId')

  const loadEvents = async () => {
    setIsLoading(true)

    try {
      const data = await fetchEvents()
      setEvents(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError(err.message || 'Errore nel caricamento degli eventi.')
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadBookings = async () => {
    if (!isAuthenticated) {
      setMyBookings([])
      return
    }

    try {
      const bookings = await fetchMyBookings()
      setMyBookings(Array.isArray(bookings) ? bookings : [])
    } catch {
      setMyBookings([])
    }
  }

  const refreshEventData = async () => {
    await Promise.all([loadEvents(), loadBookings()])
  }

  useEffect(() => {
    async function initializePage() {
      setIsLoading(true)

      try {
        const data = await fetchEvents()
        setEvents(Array.isArray(data) ? data : [])
        setError('')
      } catch (err) {
        setError(err.message || 'Errore nel caricamento degli eventi.')
        setEvents([])
      } finally {
        setIsLoading(false)
      }

      if (!isAuthenticated) {
        setMyBookings([])
        return
      }

      try {
        const bookings = await fetchMyBookings()
        setMyBookings(Array.isArray(bookings) ? bookings : [])
      } catch {
        setMyBookings([])
      }
    }

    initializePage()
  }, [isAuthenticated])

  const bookedEventIds = useMemo(() => new Set(myBookings.map((b) => b.eventId)), [myBookings])

  const openModal = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
    if (requestedEventId) {
      setSearchParams({}, { replace: true })
    }
  }

  useEffect(() => {
    if (isLoading || !requestedEventId || events.length === 0) {
      return
    }

    const requestedEvent = events.find((event) => String(event.id) === requestedEventId)

    if (!requestedEvent) {
      return
    }

    setSelectedEvent(requestedEvent)
    setIsModalOpen(true)
  }, [events, isLoading, requestedEventId])

  const showLoadingState = isLoading
  const showErrorState = !isLoading && Boolean(error)
  const showEmptyState = !isLoading && !error && events.length === 0
  const showContent = !isLoading && !error && events.length > 0

  return (
    <main>
      <PageHero
        eyebrow="Eventi"
        title="Scopri e partecipa agli eventi di ASD Soccer Dream Fermana"
        description="Allenamenti, incontri, trasferte e appuntamenti speciali pensati per far crescere la partecipazione dei ragazzi, delle famiglie e del territorio."
        tone="primary"
        actions={
          <>
            {!isAuthenticated && <ActionLink to="/accedi">Accedi alla tua area</ActionLink>}
            <ActionLink to="/contatti" variant="secondary">
              Contattaci
            </ActionLink>
          </>
        }
      />

      {isAuthenticated && myBookings.length > 0 && (
        <section className="rounded-lg border border-secondary/30 bg-secondary/10 px-6 py-6 shadow-md">
          <SectionHeading
            eyebrow="Le tue iscrizioni"
            title="I tuoi eventi prenotati"
            description="Qui trovi tutti gli appuntamenti di Soccer Dream Fermana ai quali ti sei gia iscritto."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myBookings.map((booking) => (
              <article key={booking.id} className="rounded-lg border border-secondary/30 bg-base p-4 shadow-sm">
                <p className="text-sm font-bold text-text">{booking.eventTitle}</p>
                <p className="mt-2 text-sm text-text/75">
                  {booking.eventDate ? eventDateFormatter.format(new Date(booking.eventDate)) : ''}
                </p>
                <p className="mt-1 text-sm text-text/75">{booking.location}</p>

                <a href={getEventCalendarLink(booking.eventId)} className="mt-4 inline-flex text-sm font-semibold text-primary">
                  Scarica calendario (.ics)
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="border-primary/15 px-6 py-10 lg:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            title="Tutti gli eventi"
            description="Sfoglia gli appuntamenti disponibili e scegli quelli piu adatti al tuo percorso con Soccer Dream Fermana."
          />

          <div className="flex gap-2">
            {viewModeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setViewMode(option.value)}
                className={getViewModeButtonClassName(viewMode === option.value)}
                aria-label={`Visualizza eventi in ${option.label.toLowerCase()}`}
                aria-pressed={viewMode === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {showLoadingState && (
          <div className="rounded-3xl border-2 border-primary/20 bg-base px-5 py-6 text-sm font-medium text-text/80">
            Caricamento eventi in corso...
          </div>
        )}

        {showErrorState && (
          <div className="rounded-3xl border-2 border-accent/30 bg-accent/10 px-5 py-6 text-sm font-medium text-text">
            {error}
          </div>
        )}

        {showEmptyState && (
          <div className="rounded-3xl border-2 border-primary/20 bg-base px-5 py-6 text-sm font-medium text-text/80">
            Al momento non ci sono eventi disponibili.
          </div>
        )}

        {showContent && (
          <>
            {viewMode === 'calendar' ? (
              <Calendar onEventClick={openModal} />
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {events.map((event) => {
                  const alreadyBooked = bookedEventIds.has(event.id)

                  return (
                    <button
                      key={event.id}
                      onClick={() => openModal(event)}
                      className="cursor-pointer overflow-hidden rounded-[1.4rem] border-2 border-primary/20 bg-base text-left shadow-[0_6px_14px_rgba(0,0,0,0.06)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
                      aria-label={`Visualizza dettagli evento: ${event.titolo}`}
                    >
                      {event.volantino ? (
                        <img src={event.volantino} alt={event.titolo} className="h-48 w-full object-cover" />
                      ) : (
                        <div className="flex h-48 w-full items-center justify-center bg-primary/10">
                          <PlaceholderImage alt="Event" className="h-full w-full" />
                        </div>
                      )}

                      <div className="p-5">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {event.availableSeats} posti disponibili
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
          </>
        )}
      </section>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
        onBookingChange={refreshEventData}
      />
    </main>
  )
}

export default EventiPage
