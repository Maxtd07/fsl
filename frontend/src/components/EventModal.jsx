import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faClock, faMapMarkerAlt, faDownload, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext'
import { createBooking, deleteBooking, fetchMyBookings, getEventCalendarLink } from '../lib/api'
import Button from './Button'
import Card from './Card'

export function EventModal({ event, isOpen, onClose, onBookingChange }) {
  const { isAuthenticated, user } = useAuth()
  const [isBooked, setIsBooked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (isOpen && isAuthenticated && event) {
      checkBookingStatus()
    }
  }, [isOpen, event, isAuthenticated])

  const checkBookingStatus = async () => {
    try {
      const bookings = await fetchMyBookings()
      const booking = bookings?.find((b) => b.eventId === event.id)
      setIsBooked(!!booking)
      setBookingId(booking?.id)
    } catch (err) {
      console.error('Errore verifica iscrizione:', err)
    }
  }

  const handleBooking = async () => {
    if (isBooked) {
      await handleCancelBooking()
    } else {
      await handleCreateBooking()
    }
  }

  const handleCreateBooking = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await createBooking(event.id)
      setIsBooked(true)
      setBookingId(response.id)
      setSuccess('Iscrizione confermata! Controlla la tua email.')
      onBookingChange?.()

      setTimeout(() => {
        setSuccess(null)
      }, 5000)
    } catch (err) {
      setError(err.message || 'Errore iscrizione')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!bookingId) return

    setIsLoading(true)
    setError(null)

    try {
      await deleteBooking(bookingId)
      setIsBooked(false)
      setBookingId(null)
      setSuccess('Iscrizione annullata')
      onBookingChange?.()

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError(err.message || 'Errore annullamento iscrizione')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadCalendar = () => {
    const link = getEventCalendarLink(event.id)
    const a = document.createElement('a')
    a.href = link
    a.download = `${event.titolo}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (!isOpen || !event) {
    return null
  }

  const eventDate = new Date(event.data)
  const dateStr = eventDate.toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const timeStr = eventDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false })
  const isFull = event.availableSeats === 0
  const occupancyPercent = ((event.maxPartecipanti - event.availableSeats) / event.maxPartecipanti) * 100

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <Card
        variant="elevated"
        className="w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-text/10 pb-4">
          <h2 className="text-xl font-bold text-primary">{event.titolo}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text hover:bg-text/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
            aria-label="Chiudi modale"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          {/* Event Details - Date, Time, Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-6">
              <FontAwesomeIcon icon={faCalendarDays} className="text-primary text-lg" />
              <div>
                <p className="text-xs font-semibold text-text/60 uppercase">Data</p>
                <p className="text-sm font-medium text-text">{dateStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6">
              <FontAwesomeIcon icon={faClock} className="text-primary text-lg" />
              <div>
                <p className="text-xs font-semibold text-text/60 uppercase">Orario</p>
                <p className="text-sm font-medium text-text">{timeStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary text-lg" />
              <div>
                <p className="text-xs font-semibold text-text/60 uppercase">Luogo</p>
                <p className="text-sm font-medium text-text">{event.luogo}</p>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="px-6">
            {isFull ? (
              <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
                <p className="text-sm font-semibold text-accent">
                  ⚠ Evento al completo
                </p>
                <p className="text-xs text-accent/80 mt-1">Non sono disponibili posti</p>
              </div>
            ) : (
              <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-text/70 uppercase">Posti disponibili</p>
                  <p className="text-sm font-bold text-secondary">
                    {event.availableSeats}/{event.maxPartecipanti}
                  </p>
                </div>
                <div className="h-2 bg-text/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-300"
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="px-6">
            <h3 className="text-sm font-bold text-text mb-2">Descrizione</h3>
            <p className="text-sm text-text/70 leading-relaxed">{event.descrizione}</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mx-6 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-semibold flex items-center gap-2">
              Errore: {error}
            </div>
          )}

          {success && (
            <div className="mx-6 rounded-lg border border-secondary/30 bg-secondary/10 p-3 text-xs text-secondary font-semibold flex items-center gap-2 animate-pulse">
              OK: {success}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="border-t border-text/10 px-6 py-4 space-y-3 flex-shrink-0">
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
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/8 px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
              >
                <FontAwesomeIcon icon={faDownload} className="text-xs" />
                <span>Scarica calendario (.ics)</span>
              </button>
            </>
          ) : (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-sm text-text/70 mb-3">Per iscriverti, devi essere connesso</p>
              <a
                href="/accedi"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors duration-200"
              >
                Accedi o registrati
              </a>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full rounded-lg border border-text/10 px-4 py-2.5 text-sm font-semibold text-text/70 hover:bg-text/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
          >
            Chiudi
          </button>
        </div>
      </Card>
    </div>
  )
}
