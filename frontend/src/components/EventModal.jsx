import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createBooking, deleteBooking, fetchMyBookings, getEventCalendarLink } from '../lib/api'

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
  const dateStr = eventDate.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = eventDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', hour12: false })
  const isFull = event.availableSeats === 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border-2 border-primary/20 bg-base shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary/10 px-6 py-4">
          <h2 className="text-xl font-bold text-text">{event.titolo}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-text/10"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
          {/* Date and time */}
          <div className="space-y-2 rounded-lg border border-primary/10 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-sm text-text/70">
              <span>📅</span>
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text/70">
              <span>🕐</span>
              <span>{timeStr}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text/70">
              <span>📍</span>
              <span>{event.luogo}</span>
            </div>
          </div>

          {/* Availability */}
          <div className={`rounded-lg p-3 ${isFull ? 'border border-accent/20 bg-accent/10' : 'border border-secondary/20 bg-secondary/10'}`}>
            {isFull ? (
              <p className="text-sm font-semibold text-accent">Evento al completo - Non sono disponibili posti</p>
            ) : (
              <>
                <p className="text-xs text-text/60 mb-1">Posti disponibili</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-text/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{
                        width: `${((event.maxPartecipanti - event.availableSeats) / event.maxPartecipanti) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-text">
                    {event.availableSeats}/{event.maxPartecipanti}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-text mb-2">Descrizione</h3>
            <p className="text-sm text-text/70 leading-relaxed">{event.descrizione}</p>
          </div>

          {/* Error and success messages */}
          {error && (
            <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-accent font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-3 text-xs text-secondary font-semibold">
              ✓ {success}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-primary/10 px-6 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleBooking}
                disabled={isLoading || (isFull && !isBooked)}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                  isBooked
                    ? 'border border-text/20 bg-text/5 text-text hover:bg-text/10'
                    : isFull
                      ? 'border border-text/10 bg-text/5 text-text/50 cursor-not-allowed'
                      : 'bg-primary text-base hover:bg-primary/90'
                }`}
              >
                {isLoading ? 'Elaborazione...' : isBooked ? 'Cancella iscrizione' : 'Iscrivimi'}
              </button>

              <button
                onClick={handleDownloadCalendar}
                className="w-full rounded-lg border border-primary/20 px-4 py-2.5 text-sm font-semibold text-text hover:bg-primary/10"
              >
                ⬇ Scarica calendario (.ics)
              </button>
            </>
          ) : (
            <div className="rounded-lg border border-primary/10 bg-primary/5 p-3 text-center">
              <p className="text-xs text-text/70 mb-2">Per iscriverti, devi essere connesso</p>
              <a href="/accedi" className="inline-block text-xs font-semibold text-primary hover:underline">
                Accedi o registrati →
              </a>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full rounded-lg border border-text/10 px-4 py-2.5 text-sm font-semibold text-text/70 hover:bg-text/5"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  )
}
