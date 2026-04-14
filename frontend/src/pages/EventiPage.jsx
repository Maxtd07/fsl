import { useEffect, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import MediaTile from '../components/MediaTile.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchEvents } from '../lib/api.js'

/* ---------------------------
   Instagram Embed Component
----------------------------*/
function InstagramFeed() {
  useEffect(() => {
    // avoid injecting script multiple times
    if (!document.querySelector('#elfsight-platform-script')) {
      const script = document.createElement('script')
      script.id = 'elfsight-platform-script'
      script.src = 'https://elfsightcdn.com/platform.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div
      className="elfsight-app-614ff7dd-13fe-40be-841d-0b9e0c186e97"
      data-elfsight-app-lazy
    />
  )
}

/* ---------------------------
   Date formatting
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

  if (event.data) {
    meta.push(eventDateFormatter.format(new Date(event.data)))
  }

  if (event.luogo) {
    meta.push(event.luogo)
  }

  return meta.join(' | ')
}

/* ---------------------------
   Page
----------------------------*/
function EventiPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadEvents() {
      try {
        const data = await fetchEvents()
        if (!mounted) return

        setEvents(Array.isArray(data) ? data : [])
      } catch {
        if (!mounted) return
        setErrorMessage('Impossibile caricare gli eventi dal backend.')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadEvents()
    return () => (mounted = false)
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

      {/* EVENTS LIST */}
      <section className="border-t-2 border-primary/15 px-6 py-10 lg:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Prossimi eventi"
            title="Eventi caricati direttamente dal backend."
            description="La lista arriva dall’endpoint Spring Boot /events."
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

        {errorMessage && (
          <div className="rounded-[1.5rem] border-2 border-accent/30 bg-accent/10 px-5 py-6 text-sm font-medium text-text">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && events.length === 0 && (
          <div className="rounded-[1.5rem] border-2 border-primary/20 bg-base px-5 py-6 text-sm font-medium text-text/80">
            Nessun evento disponibile al momento.
          </div>
        )}

        {!isLoading && !errorMessage && events.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            {events.map((event, index) => (
              <MediaTile
                key={event.id ?? index}
                alt={`Evento ${index + 1}`}
                title={event.titolo}
                meta={formatEventMeta(event)}
                description={event.descrizione}
              />
            ))}
          </div>
        )}
      </section>

      {/* PROGRAMMA */}
      <section className="border-t-2 border-primary/15 bg-background px-6 py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <PlaceholderImage alt="Programma eventi" className="aspect-[4/3] w-full" />

          <div>
            <SectionHeading
              eyebrow="Programma"
              title="Sed ut perspiciatis unde omnis iste natus error."
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            />
          </div>
        </div>
      </section>

      {/* INSTAGRAM FEED */}
      <section className="border-t-2 border-primary/15 px-6 py-10 lg:py-12">
        <SectionHeading
          eyebrow="Social"
          title="Seguici su Instagram"
          description="Aggiornamenti, eventi e attività in tempo reale."
        />

        <div className="mt-6">
          <InstagramFeed />
        </div>
      </section>
    </main>
  )
}

export default EventiPage