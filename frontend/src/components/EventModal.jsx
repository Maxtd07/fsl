import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faClock, faMapMarkerAlt, faDownload, faTimes, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/useAuth.js'
import { createBooking, deleteBooking, fetchMyBookings, getEventCalendarLink } from '../lib/api'
import { formatEventType } from '../lib/events'
import Button from './Button'
import Card from './Card'

const successTimeoutByAction = {
  create: 5000,
  cancel: 3000,
  share: 3000,
}

const PUBLIC_EVENTS_PATH = '/eventi'

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

function getEventShareUrl() {
  if (typeof window === 'undefined') {
    return PUBLIC_EVENTS_PATH
  }

  return new URL(PUBLIC_EVENTS_PATH, window.location.origin).toString()
}

function sanitizeFileName(value) {
  return (value ?? 'evento')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'evento'
}

function getFileExtension(mimeType, imageUrl) {
  if (mimeType === 'image/png') return 'png'
  if (mimeType === 'image/webp') return 'webp'
  if (mimeType === 'image/gif') return 'gif'

  if (imageUrl?.startsWith('data:image/png')) return 'png'
  if (imageUrl?.startsWith('data:image/webp')) return 'webp'
  if (imageUrl?.startsWith('data:image/gif')) return 'gif'

  return 'jpg'
}

async function buildShareFile(imageUrl, title) {
  if (!imageUrl || typeof File === 'undefined') {
    return null
  }

  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error('Impossibile preparare il volantino per la condivisione')
  }

  const blob = await response.blob()
  const extension = getFileExtension(blob.type, imageUrl)
  return new File([blob], `${sanitizeFileName(title)}.${extension}`, {
    type: blob.type || 'image/jpeg',
  })
}

function EventInfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
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
    <div className={`flex items-center gap-2 rounded-lg border p-3 text-xs font-semibold ${className}`}>
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
  const isUnlimitedCapacity = Boolean(event.unlimitedCapacity)
  const isFull = !isUnlimitedCapacity && event.availableSeats === 0
  const occupancyPercent = isUnlimitedCapacity
    ? 0
    : ((event.maxPartecipanti - event.availableSeats) / event.maxPartecipanti) * 100
  const shareUrl = getEventShareUrl()
  const shareText = [
    event.titolo,
    `${date} alle ${time}${event.luogo ? `\n${event.luogo}` : ''}`,
    '',
    shareUrl,
  ].join('\n')

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
      showTimedSuccess(
        response?.emailSent
          ? 'Partecipazione confermata. Controlla la tua email.'
          : "Partecipazione confermata. Se l'email non arriva, scarica il file calendario qui sotto.",
        'create',
      )
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
      showTimedSuccess('Partecipazione annullata', 'cancel')
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

  const handleShareEvent = async () => {
    resetMessages()

    try {
      if (navigator.share) {
        let shared = false

        if (event.volantino) {
          try {
            const file = await buildShareFile(event.volantino, event.titolo)
            if (file && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
              await navigator.share({
                title: event.titolo,
                text: shareText,
                url: shareUrl,
                files: [file],
              })
              shared = true
            }
          } catch (shareFileError) {
            console.warn('Condivisione volantino non disponibile:', shareFileError)
          }
        }

        if (!shared) {
          await navigator.share({
            title: event.titolo,
            text: shareText,
            url: shareUrl,
          })
        }

        showTimedSuccess('Evento condiviso.', 'share')
        return
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText)
        showTimedSuccess('Link evento copiato negli appunti.', 'share')
        return
      }

      setError('La condivisione non è supportata da questo browser.')
    } catch (err) {
      if (err?.name === 'AbortError') {
        return
      }

      setError('Condivisione non riuscita')
    }
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
        padding={false}
        className={`max-h-[90vh] w-full overflow-hidden ${event.volantino ? 'max-w-5xl' : 'max-w-md'}`}
        onClick={(currentEvent) => currentEvent.stopPropagation()}
      >
        <div className={event.volantino ? 'grid lg:grid-cols-[minmax(280px,0.88fr)_minmax(0,1.12fr)]' : ''}>
          {event.volantino && (
            <div className="border-b border-text/10 bg-background lg:border-b-0 lg:border-r lg:border-text/10">
              <div className="flex h-full items-center justify-center p-4 sm:p-5">
                <img
                  src={event.volantino}
                  alt={`Volantino evento: ${event.titolo}`}
                  className="w-full rounded-xl border border-primary/10 bg-white object-contain shadow-sm max-h-[42vh] lg:max-h-[82vh]"
                />
              </div>
            </div>
          )}

          <div className="flex max-h-[90vh] flex-col">
            <div className="flex items-center justify-between border-b border-text/10 px-6 pb-4 pt-6">
              <div className="pr-4">
                <span className="inline-flex rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-secondary">
                  {formatEventType(event.tipo)}
                </span>
                <h2 className="mt-3 text-xl font-bold text-primary">{event.titolo}</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-text transition-colors duration-200 hover:bg-text/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
                aria-label="Chiudi finestra"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                <EventInfoRow icon={faCalendarDays} label="Data" value={date} />
                <EventInfoRow icon={faClock} label="Orario" value={time} />
                <EventInfoRow icon={faMapMarkerAlt} label="Luogo" value={event.luogo} />
              </div>

              {!isUnlimitedCapacity && (
                <div>
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
              )}

              <div>
                <h3 className="mb-2 text-sm font-bold text-text">Descrizione</h3>
                <p className="text-sm leading-relaxed text-text/70">{event.descrizione}</p>
              </div>

              {error && <FeedbackMessage tone="error">Errore: {error}</FeedbackMessage>}
              {success && <FeedbackMessage tone="success">OK: {success}</FeedbackMessage>}
            </div>

            <div className="flex-shrink-0 space-y-3 border-t border-text/10 px-6 py-4">
              <button
                onClick={handleShareEvent}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/8 px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/12 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
              >
                <FontAwesomeIcon icon={faShareNodes} className="text-xs" />
                <span>Condividi evento</span>
              </button>

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
                    {isLoading ? 'Elaborazione...' : isBooked ? 'Cancella iscrizione' : 'Partecipa'}
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
                  <p className="mb-3 text-sm text-text/70">Accedi alla tua area per partecipare a questo evento.</p>
                  <a
                    href="/accedi"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-primary/90"
                  >
                    Accedi alla tua area
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
        </div>
      </Card>
    </div>
  )
}
