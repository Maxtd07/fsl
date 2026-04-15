import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faClock, faMapMarkerAlt, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/useAuth.js'
import { createBooking, deleteBooking, fetchMyBookings, getEventCalendarLink } from '../lib/api'
import Button from './Button'
import Card from './Card'

const successTimeoutByAction = {
  create: 5000,
  cancel: 3000,
}

function formatEventDate(dateValue) {
  const eventDate = new Date(dateValue)

  return {
    date: eventDate.toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: eventDate.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  }
}

function EventInfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-6">
      <FontAwesomeIcon icon={icon} className="text-lg text-primary" />
      <div>
        <p className="text-xs font-semibold uppercase text-text/60">{label}</p>
        <p className="text-sm font-medium text-text">{value}</p>
      </div>
    </div>
  )
}

function FeedbackMessage({ tone, children }) {
  const className =
    tone === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-secondary/30 bg-secondary/10 text-secondary animate-pulse'

  return (
    <div className={`mx-6 flex items-center gap-2 rounded-lg border p-3 text-xs font-semibold ${className}`}>
      {children}
    </div>
  )
}

export function EventModal({ event, isOpen, onClose, onBookingChange }) {
  const { isAuthenticated } = useAuth()
  const [isBooked, setIsBooked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (!isOpen || !isAuthenticated || !event) {
      return
    }

    async function checkBookingStatus() {
      try {
        const bookings = await fetchMyBookings()
        const booking = bookings?.find((item) => item.eventId === event.id)
        setIsBooked(Boolean(booking))
        setBookingId(booking?.id ?? null)
      } catch (err) {
        console.error('Errore verifica iscrizione:', err)
      }
    }

    checkBookingStatus()
  }, [event, isAuthenticated, isOpen])

  if (!isOpen || !event) {
    return null
  }

  const { date, time } = formatEventDate(event.data)
  const isFull = event.availableSeats === 0
  const occupancyPercent = ((event.maxPartecipanti - event.availableSeats) / event.maxPartecipanti) * 100

  const resetMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const showTimedSuccess = (message, action) => {
    setSuccess(message)
    setTimeout(() => {
      setSuccess(null)
    }, successTimeoutByAction[action])
  }

  const handleBooking = async () => {
    if (isBooked) {
      await handleCancelBooking()
      return
    }

    await handleCreateBooking()
  }

  const handleCreateBooking = async () => {
    setIsLoading(true)
    resetMessages()

    try {
      const response = await createBooking(event.id)
      setIsBooked(true)
      setBookingId(response.id)
      showTimedSuccess('Iscrizione confermata! Controlla la tua email.', 'create')
      onBookingChange?.()
    } catch (err) {
      setError(err.message || 'Errore iscrizione')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!bookingId) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await deleteBooking(bookingId)
      setIsBooked(false)
      setBookingId(null)
      showTimedSuccess('Iscrizione annullata', 'cancel')
      onBookingChange?.()
    } catch (err) {
      setError(err.message || 'Errore annullamento iscrizione')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCalendar = () => {
    const link = getEventCalendarLink(event.id)
    const anchor = document.createElement('a')
    anchor.href = link
    anchor.download = `${event.titolo}.ics`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <Card
        variant="elevated"
        className="max-h-[90vh] w-full max-w-md overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-text/10 pb-4">
            <h2 className="text-xl font-bold text-primary">{event.titolo}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-text transition-colors duration-200 hover:bg-text/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
              aria-label="Chiudi modale"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto py-4">
            <div className="space-y-3">
              <EventInfoRow icon={faCalendarDays} label="Data" value={date} />
              <EventInfoRow icon={faClock} label="Orario" value={time} />
              <EventInfoRow icon={faMapMarkerAlt} label="Luogo" value={event.luogo} />
            </div>

            <div className="px-6">
              {isFull ? (
                <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
                  <p className="text-sm font-semibold text-accent">Evento al completo</p>
                  <p className="mt-1 text-xs text-accent/80">Non sono disponibili posti</p>
                </div>
              ) : (
                <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase text-text/70">Posti disponibili</p>
                    <p className="text-sm font-bold text-secondary">
                      {event.availableSeats}/{event.maxPartecipanti}
                    </p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-text/10">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-300"
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="px-6">
              <h3 className="mb-2 text-sm font-bold text-text">Descrizione</h3>
              <p className="text-sm leading-relaxed text-text/70">{event.descrizione}</p>
            </div>

            {error && <FeedbackMessage tone="error">Errore: {error}</FeedbackMessage>}
            {success && <FeedbackMessage tone="success">OK: {success}</FeedbackMessage>}
          </div>

          <div className="flex-shrink-0 space-y-3 border-t border-text/10 px-6 py-4">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={handleBooking}
                  disabled={isLoading || (isFull && !isBooked)}
                  variant={isBooked ? 'outline' : isFull && !isBooked ? 'ghost' : 'primary'}
                  size="md"
                  fullWidth
                  isLoading={isLoading}
                >
                  {isLoading ? 'Elaborazione...' : isBooked ? 'Cancella iscrizione' : 'Iscrivimi'}
                </Button>

                <button
                  onClick={handleDownloadCalendar}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/8 px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
                >
                  <FontAwesomeIcon icon={faDownload} className="text-xs" />
                  <span>Scarica calendario (.ics)</span>
                </button>
              </>
            ) : (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
                <p className="mb-3 text-sm text-text/70">Per iscriverti, devi essere connesso</p>
                <a
                  href="/accedi"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-primary/90"
                >
                  Accedi o registrati
                </a>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full rounded-lg border border-text/10 px-4 py-2.5 text-sm font-semibold text-text/70 transition-colors duration-200 hover:bg-text/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
            >
              Chiudi
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
