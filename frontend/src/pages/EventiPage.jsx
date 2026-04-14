import { useEffect, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import MediaTile from '../components/MediaTile.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchEvents } from '../lib/api.js'

/* ---------------------------
   Safe date formatter
----------------------------*/
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
    // fail silently → prevents render crash
  }

  return meta.join(' | ')
}

/* ---------------------------
   Page
----------------------------*/
function EventiPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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
      <section className="border-t-2 border-primary/15 px-6 py-10 lg:py-12">
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
          <div className="rounded-[1.5rem] border-2 border-primary/20 bg-base px-5 py-6 text-sm font-medium text-text/80">
            Caricamento eventi in corso...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-[1.5rem] border-2 border-accent/30 bg-accent/10 px-5 py-6 text-sm font-medium text-text">
            {error}
          </div>
        )}

        {!isLoading && !error && events.length === 0 && (
          <div className="rounded-[1.5rem] border-2 border-primary/20 bg-base px-5 py-6 text-sm font-medium text-text/80">
            Nessun evento disponibile al momento.
          </div>
        )}

        {!isLoading && !error && events.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event, index) => (
              <MediaTile
                key={event?.id ?? index}
                alt={`Evento ${index + 1}`}
                title={event?.titolo ?? 'Evento'}
                meta={formatEventMeta(event)}
                description={event?.descrizione ?? ''}
              />
            ))}
          </div>
        )}
      </section>

      {/* PROGRAMMA */}
      <section className="border-t-2 border-primary/15 bg-background px-6 py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <PlaceholderImage
            alt="Programma eventi"
            className="aspect-[4/3] w-full"
          />

          <SectionHeading
            eyebrow="Programma"
            title="Sed ut perspiciatis unde omnis iste natus error."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          />
        </div>
      </section>
    </main>
  )
}

export default EventiPage