import { useEffect, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import MediaTile from '../components/MediaTile.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchEvents } from '../lib/api.js'

const scheduleRows = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
]

const eventDateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatEventMeta(event) {
  const metaParts = []

  if (event.data) {
    metaParts.push(eventDateFormatter.format(new Date(event.data)))
  }

  if (event.luogo) {
    metaParts.push(event.luogo)
  }

  return metaParts.join(' | ')
}

function EventiPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadEvents() {
      try {
        const data = await fetchEvents()

        if (!isMounted) {
          return
        }

        setEvents(Array.isArray(data) ? data : [])
      } catch {
        if (!isMounted) {
          return
        }

        setErrorMessage('Impossibile caricare gli eventi dal backend.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main>
      <PageHero
        eyebrow="Eventi"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit ut labore."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
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

      <section className="border-t-2 border-primary/15 px-6 py-8 md:py-10 lg:py-12">
        <div className="mb-4 md:mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Prossimi eventi"
            title="Eventi caricati direttamente dal backend."
            description="La lista qui sotto arriva dall'endpoint Spring Boot `/events`."
          />
          <ActionLink to="/contatti" variant="secondary">
            Chiedi informazioni
          </ActionLink>
        </div>

        {isLoading ? (
          <div className="rounded-[1.5rem] border-2 border-primary/20 bg-base px-5 py-6 text-sm font-medium text-text/80 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
            Caricamento eventi in corso...
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-[1.5rem] border-2 border-accent/30 bg-accent/10 px-5 py-6 text-sm font-medium text-text shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && events.length === 0 ? (
          <div className="rounded-[1.5rem] border-2 border-primary/20 bg-base px-5 py-6 text-sm font-medium text-text/80 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
            Nessun evento disponibile al momento nel backend.
          </div>
        ) : null}

        {!isLoading && !errorMessage && events.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event, index) => (
              <MediaTile
                key={event.id ?? `${event.titolo}-${index}`}
                alt={`Evento ${index + 1}`}
                title={event.titolo}
                meta={formatEventMeta(event)}
                description={event.descrizione}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="border-t-2 border-primary/15 bg-background px-6 py-8 md:py-10 lg:py-12">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <PlaceholderImage alt="Programma eventi" className="aspect-[4/3] w-full" />
          <div>
            <SectionHeading
              eyebrow="Programma"
              title="Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
            <div className="mt-6 space-y-5">
              {scheduleRows.map((text, index) => (
                <div
                  key={text}
                  className="rounded-[1.5rem] border-2 border-primary/20 bg-base px-4 md:px-5 py-4 md:py-5 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default EventiPage
