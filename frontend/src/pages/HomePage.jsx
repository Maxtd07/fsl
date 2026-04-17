import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ActionLink from '../components/ActionLink.jsx'
import MediaTile from '../components/MediaTile.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchEvents, fetchPhotos } from '../lib/api.js'
import { isGenericEvent, isMatchEvent } from '../lib/events.js'

const eventDateFormatter = new Intl.DateTimeFormat('it-IT', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

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

function HomePage() {
  const [events, setEvents] = useState([])
  const [photos, setPhotos] = useState([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true)
  const [errorEvents, setErrorEvents] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true)
      try {
        const data = await fetchEvents()
        setEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        setErrorEvents(err.message || 'Impossibile caricare gli eventi')
        setEvents([])
      } finally {
        setIsLoadingEvents(false)
      }
    }

    loadEvents()
  }, [])

  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoadingPhotos(true)
      try {
        const data = await fetchPhotos()
        setPhotos(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Errore caricamento foto:', err)
        setPhotos([])
      } finally {
        setIsLoadingPhotos(false)
      }
    }

    loadPhotos()
  }, [])

  const displayedEvents = events.slice(0, 3)
  const displayedPhotos = photos.slice(0, 4)
  const displayedMatches = events.filter(isMatchEvent).slice(0, 3)
  const displayedGenericEvents = events.filter(isGenericEvent).slice(0, 3)

  const renderEventPreviewSection = ({ title, description, items, emptyMessage }) => (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-text">{title}</h3>
          <p className="mt-1 text-sm text-text/70">{description}</p>
        </div>
        <div className="h-px flex-1 bg-primary/12" />
      </div>

      {items.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((event) => (
            <Link
              key={event.id}
              to={`/eventi?eventId=${encodeURIComponent(event.id)}`}
              className="block rounded-[1.75rem] transition-transform duration-200 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"
              aria-label={`Apri dettagli evento: ${event.titolo}`}
            >
              <MediaTile
                title={event.titolo}
                meta={formatEventMeta(event)}
                description={event.descrizione}
                alt={event.titolo}
                imageSrc={event.volantino}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-primary/15 bg-base px-5 py-6 text-sm font-medium text-text/70">
          {emptyMessage}
        </div>
      )}
    </div>
  )

  return (
    <main>
      <PageHero
        eyebrow="ASD Soccer Dream Fermana"
        title="Calcio inclusivo, sport e comunita a misura di persona."
        description="ASD Soccer Dream Fermana promuove attivita sportive inclusive per ragazzi con disabilita cognitive e relazionali, con base a Grottazzolina e un legame forte con il territorio fermano."
        tone="primary"
      />

      <section className="px-6 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <SectionHeading
              eyebrow="Chi siamo"
              title="Una squadra nata per far vivere il calcio come esperienza di inclusione."
              description="La realta di Soccer Dream Fermana e cresciuta dal percorso Montepacini e oggi porta avanti un progetto sportivo e sociale che mette insieme ragazzi, famiglie, volontari e comunita."
            />

            <p className="mt-5 max-w-3xl text-xs font-medium leading-7 text-text md:mt-6 md:text-sm">
              Dal 2019 il nome Soccer Dream Fermana accompagna un cammino che unisce sport, autonomia e relazioni. Il
              progetto nasce per offrire ai ragazzi occasioni vere di gioco, partecipazione e divertimento, senza
              ridurre tutto al risultato sportivo.
            </p>

            <div className="mt-6">
              <ActionLink to="/chi-siamo" variant="secondary" className="text-sm md:text-base">
                Scopri di piu
              </ActionLink>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-lg border border-primary/20 bg-background px-4 py-4 shadow-sm md:px-5 md:py-5">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">Identita e missione</p>
              <p className="mt-2 text-xs font-medium leading-6 text-text md:mt-3 md:text-sm md:leading-7">
                Il calcio e lo strumento, ma il traguardo e piu grande: costruire fiducia, appartenenza e spazi in cui
                ogni ragazzo possa sentirsi accolto.
              </p>
            </div>

            <div className="rounded-lg border border-secondary/30 bg-secondary/8 px-4 py-4 shadow-sm md:px-5 md:py-5">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">Metodo e attivita</p>
              <p className="mt-2 text-xs font-medium leading-6 text-text md:mt-3 md:text-sm md:leading-7">
                Allenamenti, trasferte, eventi, collaborazione con Fermana e progetto Insieme Fermana fanno parte di un
                percorso che allarga le opportunita per i ragazzi e le loro famiglie.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Calendario"
            title="Partite ed eventi in evidenza"
            description="La home separa gli appuntamenti sportivi dalle iniziative del club, cosi da rendere piu immediata la consultazione."
          />

          <ActionLink to="/eventi" variant="secondary" className="whitespace-nowrap flex-shrink-0">
            Vedi tutti
          </ActionLink>
        </div>

        {isLoadingEvents ? (
          <div className="py-8 text-center text-text/60">
            <p>Caricamento eventi...</p>
          </div>
        ) : errorEvents ? (
          <div className="py-8 text-center text-red-600">
            <p>{errorEvents}</p>
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="space-y-10">
            {renderEventPreviewSection({
              title: 'Prossime partite',
              description: 'Le gare in programma della squadra.',
              items: displayedMatches,
              emptyMessage: 'Nessuna partita disponibile al momento.',
            })}

            {renderEventPreviewSection({
              title: 'Prossimi eventi',
              description: 'Incontri, iniziative e appuntamenti aperti alla comunita.',
              items: displayedGenericEvents,
              emptyMessage: 'Nessun evento disponibile al momento.',
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-text/60">
            <p>Nessun evento disponibile al momento</p>
          </div>
        )}
      </section>

      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Galleria"
            title="Ultimi scatti dal mondo Soccer Dream Fermana"
            description="Momenti condivisi tra partite, allenamenti, eventi e iniziative vissute con i ragazzi e con il territorio."
          />

          <ActionLink to="/galleria" variant="secondary" className="whitespace-nowrap flex-shrink-0">
            Vedi la galleria
          </ActionLink>
        </div>

        {isLoadingPhotos ? (
          <div className="py-8 text-center text-text/60">
            <p>Caricamento galleria...</p>
          </div>
        ) : displayedPhotos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {displayedPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative overflow-hidden rounded-lg border border-primary/20 text-left shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                {photo.immagine ? (
                  <>
                    <img src={photo.immagine} alt={photo.titolo} className="h-64 w-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
                  </>
                ) : (
                  <PlaceholderImage alt={photo.titolo} className="h-64 w-full" />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
                  <h3 className="text-sm font-bold text-white">{photo.titolo}</h3>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-text/60">
            <p>Nessuna foto disponibile al momento</p>
          </div>
        )}
      </section>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedPhoto(null)}>
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-lg bg-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute right-4 top-4 z-10 text-lg font-bold text-white transition hover:opacity-70"
            >
              x
            </button>
            <img
              src={selectedPhoto.immagine}
              alt={selectedPhoto.titolo}
              className="h-auto max-h-[70vh] w-full object-contain"
            />
            <div className="bg-base p-4">
              <h2 className="mb-1 text-lg font-bold text-text">{selectedPhoto.titolo}</h2>
              <p className="text-sm text-text/75">{selectedPhoto.descrizione}</p>
            </div>
          </div>
        </div>
      )}

      <section className="mt-6 rounded-lg border border-primary/20 bg-background px-4 py-10 text-center shadow-lg md:px-6 md:py-12 lg:px-8 lg:py-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Sostieni</p>
        <h2 className="text-2xl font-bold tracking-tight text-text md:text-3xl lg:text-4xl">Sostieni i nostri progetti</h2>
        <p className="mx-auto mt-4 max-w-2xl text-xs font-medium leading-6 text-text/75 md:mt-5 md:text-sm md:leading-7">
          Il sostegno economico aiuta ASD Soccer Dream Fermana a rendere piu accessibili attivita, trasferte, materiali
          e nuovi spazi legati al progetto Insieme Fermana.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2 md:mt-7 md:gap-3">
          <ActionLink to="/donazioni" variant="secondary">
            Scopri come donare
          </ActionLink>
          <ActionLink to="/contatti" variant="secondary">
            Richiedi informazioni
          </ActionLink>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-primary/20 bg-primary px-4 py-10 text-center text-white shadow-xl md:px-6 md:py-12 lg:px-8 lg:py-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">Contatti</p>

        <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">Parla con ASD Soccer Dream Fermana</h2>

        <p className="mx-auto mt-4 max-w-2xl text-xs font-medium leading-6 text-white/90 md:mt-5 md:text-sm md:leading-7 lg:text-base">
          Se vuoi conoscere il progetto, partecipare a un evento o capire come sostenere la squadra, scrivici: ti
          risponderemo con piacere.
        </p>

        <div className="mt-6 flex justify-center md:mt-7">
          <ActionLink to="/contatti" variant="dark">
            Scrivici
          </ActionLink>
        </div>
      </section>
    </main>
  )
}

export default HomePage
