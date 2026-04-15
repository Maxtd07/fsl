import { useEffect, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import MediaTile from '../components/MediaTile.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchEvents, fetchPhotos } from '../lib/api.js'

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

  // Limita a 3 eventi e 4 foto
  const displayedEvents = events.slice(0, 3)
  const displayedPhotos = photos.slice(0, 4)

  return (
    <main>
      <PageHero
        eyebrow="Benvenuti in La Crisalide"
        title="Valorizziamo le abilità, non le mancanze. "
        description="La Crisalide nasce con un obiettivo chiaro: accompagnare ogni persona in un percorso di crescita e trasformazione, sviluppando autonomia e consapevolezza.
Come la crisalide che si trasforma in farfalla, crediamo che ogni individuo abbia potenzialità da far emergere e coltivare."
        tone="primary"
      />

      {/* CHI SIAMO */}
      <section className="px-6 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <SectionHeading
              eyebrow="Chi siamo"
              title="una parola su di noi"
              description="La Crisalide è un’associazione attiva da oltre vent’anni
              nel supporto e nell’integrazione delle persone con disabilità e delle loro famiglie.
              Fin dall’inizio, l’obiettivo è stato quello di valorizzare le abilità individuali,
              costruendo percorsi personalizzati che tengano conto delle caratteristiche e dei bisogni di ciascuno."
            />

            <p className="mt-5 md:mt-6 max-w-3xl text-xs md:text-sm font-medium leading-7 text-text">
              Crediamo che ogni persona abbia potenzialità da sviluppare attraverso opportunità concrete, senza fermarsi davanti alle difficoltà.

              Siamo stati tra i primi in Italia a credere nella musicoterapia come strumento educativo e relazionale. Nel tempo abbiamo sviluppato attività orientate all’autonomia, aiutando i ragazzi a vivere esperienze quotidiane come spostarsi, organizzarsi e relazionarsi in modo indipendente.

              Gli educatori costruiscono percorsi su misura, accompagnando ogni partecipante in un processo di crescita personale e sociale.
            </p>

            <div className="mt-6">
              <ActionLink to="/chi-siamo" variant="secondary" className="text-sm md:text-base">
                Scopri di piu
              </ActionLink>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-lg border border-primary/20 bg-background px-4 md:px-5 py-4 md:py-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Identità e Missione
              </p>
              <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-text">
                La Crisalide è un’associazione che da oltre vent’anni promuove l’inclusione e l’autonomia
                delle persone con disabilità.Crediamo nelle capacità di ogni individuo e lavoriamo per
                svilupparle attraverso esperienze concrete e percorsi personalizzati.
              </p>
            </div>

            <div className="rounded-lg border border-secondary/30 bg-secondary/8 px-4 md:px-5 py-4 md:py-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Metodo e Attività
              </p>
              <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-text">
                Costruiamo percorsi su misura che favoriscono la crescita personale e l’indipendenza.
                Attraverso laboratori, attività di gruppo e progetti di autonomia, accompagniamo ogni
                persona nel proprio sviluppo, valorizzando le sue potenzialità.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTI */}
      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Prossimi eventi"
            title="Scopri qui i nostri prossimi eventi"
            description="organizzati da La Crisalide e partecipa alle nostre iniziative per sostenere la nostra missione e condividere momenti di crescita e inclusione."
          />

          <ActionLink to="/eventi" variant="secondary" className="whitespace-nowrap flex-shrink-0">
            Vedi tutti
          </ActionLink>
        </div>

        {isLoadingEvents ? (
          <div className="text-center py-8 text-text/60">
            <p>Caricamento eventi...</p>
          </div>
        ) : errorEvents ? (
          <div className="text-center py-8 text-red-600">
            <p>{errorEvents}</p>
          </div>
        ) : displayedEvents.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {displayedEvents.map((event) => (
              <MediaTile
                key={event.id}
                title={event.titolo}
                meta={formatEventMeta(event)}
                description={event.descrizione}
                alt={event.titolo}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text/60">
            <p>Nessun evento disponibile al momento</p>
          </div>
        )}
      </section>

      {/* GALLERIA */}
      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Galleria"
            title="Ultimi scatti dalla nostra community"
            description="Momenti speciali catturati dai nostri partecipanti."
          />

          <ActionLink to="/galleria" variant="secondary" className="whitespace-nowrap flex-shrink-0">
            Vedi tutto
          </ActionLink>
        </div>

        {isLoadingPhotos ? (
          <div className="text-center py-8 text-text/60">
            <p>Caricamento galleria...</p>
          </div>
        ) : displayedPhotos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {displayedPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative overflow-hidden rounded-lg border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-left"
              >
                {photo.immagine ? (
                  <>
                    <img
                      src={photo.immagine}
                      alt={photo.titolo}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
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
          <div className="text-center py-8 text-text/60">
            <p>Nessuna foto disponibile al momento</p>
          </div>
        )}
      </section>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full rounded-lg overflow-hidden bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 text-white text-lg font-bold hover:opacity-70 transition"
            >
              x
            </button>
            <img
              src={selectedPhoto.immagine}
              alt={selectedPhoto.titolo}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            <div className="bg-base p-4">
              <h2 className="text-lg font-bold text-text mb-1">{selectedPhoto.titolo}</h2>
              <p className="text-sm text-text/75">{selectedPhoto.descrizione}</p>
            </div>
          </div>
        </div>
      )}

      {/* DONAZIONI CTA */}
      <section className="mt-6 rounded-lg border border-primary/20 bg-background px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-14 text-center shadow-lg">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          Sostieni
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-text">
          Sostieni La Crisalide
        </h2>
        <p className="mx-auto mt-4 md:mt-5 max-w-2xl text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/75">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="mt-6 md:mt-7 flex flex-wrap justify-center gap-2 md:gap-3">
          <ActionLink to="/donazioni" variant="secondary">Dona ora</ActionLink>
          <ActionLink to="/contatti" variant="secondary">
            Richiedi informazioni
          </ActionLink>
        </div>
      </section>

      {/* CONTATTI CTA */}
      <section className="mt-6 rounded-lg border border-primary/20 bg-primary px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-14 text-center text-white shadow-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
          Resta in contatto
        </p>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
          Rimani sempre aggiornato
        </h2>

        <p className="mx-auto mt-4 md:mt-5 max-w-2xl text-xs md:text-sm lg:text-base font-medium leading-6 md:leading-7 text-white/90">
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>

        <div className="mt-6 md:mt-7 flex justify-center">
          <ActionLink to="/contatti" variant="dark">
            Scrivici
          </ActionLink>
        </div>
      </section>
    </main>
  )
}

export default HomePage