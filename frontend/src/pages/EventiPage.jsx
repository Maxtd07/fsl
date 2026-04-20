import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchEvents, fetchMyBookings, getEventCalendarLink } from '../lib/api.js'
import { useAuth } from '../context/useAuth.js'
import { useFetch } from '../hooks/useFetch.js'
import { Calendar } from '../components/Calendar.jsx'
import { EventModal as EventDetailsModal } from '../components/EventModal.jsx'
import { formatEventType, isGenericEvent, isMatchEvent } from '../lib/events.js'

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
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('list')
  const requestedEventId = searchParams.get('eventId')

  // Usa custom hook per fetch events e bookings
  const { data: events, isLoading, error, refetch: refetchEvents } = useFetch(fetchEvents, [])
  const { data: myBookings, refetch: refetchBookings } = useFetch(
    isAuthenticated ? fetchMyBookings : async () => [],
    [isAuthenticated]
  )

  const bookedEventIds = useMemo(() => new Set(myBookings.map((b) => b.eventId)), [myBookings])
  const matchEvents = useMemo(() => events.filter(isMatchEvent), [events])
  const genericEvents = useMemo(() => events.filter(isGenericEvent), [events])

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

  const refreshEventData = async () => {
    await Promise.all([refetchEvents(), refetchBookings()])
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

  const renderEventSection = ({ title, description, items, eventType }) => (
    <section className="space-y-5 rounded-[2rem] border border-primary/15 bg-base p-5 shadow-[0_12px_28px_rgba(0,0,0,0.04)] md:p-6">
      <div className="flex items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-text">{title}</h3>
          <p className="mt-1 text-sm text-text/70">{description}</p>
        </div>
        <div className="h-px flex-1 bg-primary/12" />
      </div>

      {viewMode === 'calendar' ? (
        items.length > 0 ? (
          <Calendar onEventClick={openModal} eventType={eventType} />
        ) : (
          <div className="rounded-3xl border-2 border-primary/20 bg-background px-5 py-6 text-sm font-medium text-text/80">
            {eventType === 'partita'
              ? 'Nessuna partita disponibile al momento.'
              : 'Nessun evento disponibile al momento.'}
          </div>
        )
      ) : items.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((event) => {
            const alreadyBooked = bookedEventIds.has(event.id)
            const showCapacity = !event.unlimitedCapacity

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
                    <span className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                      {formatEventType(event.tipo)}
                    </span>

                    {showCapacity && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {event.availableSeats} posti disponibili
                      </span>
                    )}

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
      ) : (
        <div className="rounded-3xl border-2 border-primary/20 bg-background px-5 py-6 text-sm font-medium text-text/80">
          {eventType === 'partita'
            ? 'Nessuna partita disponibile al momento.'
            : 'Nessun evento disponibile al momento.'}
        </div>
      )}
    </section>
  )

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
            description="Qui trovi tutti gli appuntamenti di Soccer Dream Fermana ai quali ti sei già iscritto."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myBookings.map((booking) => (
              <article key={booking.id} className="rounded-lg border border-secondary/30 bg-base p-4 shadow-sm">
                <p className="text-sm font-bold text-text">{booking.eventTitle}</p>
                <p className="mt-2 inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                  {formatEventType(booking.eventType)}
                </p>
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
            title="Partite ed eventi"
            description="Ogni appuntamento viene mostrato nella sua sezione dedicata, cosi da distinguere chiaramente calendario sportivo e iniziative del club."
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
          <div className="space-y-8">
            {renderEventSection({
              title: 'Partite',
              description: 'Le gare della squadra, con accesso rapido ai dettagli e alle prenotazioni.',
              items: matchEvents,
              eventType: 'partita',
            })}

            {renderEventSection({
              title: 'Eventi',
              description: 'Incontri, iniziative e appuntamenti organizzati da ASD Soccer Dream Fermana.',
              items: genericEvents,
              eventType: 'evento',
            })}
          </div>
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
