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
        setErrorEvents(err.message || 'Lorem ipsum dolor sit amet')
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
        console.error('Lorem ipsum error:', err)
        setPhotos([])
      } finally {
        setIsLoadingPhotos(false)
      }
    }

    loadPhotos()
  }, [])

  const displayedEvents = events.slice(0, 3)
  const displayedPhotos = photos.slice(0, 4)

  return (
    <main>
      <PageHero
        eyebrow="Lorem ipsum"
        title="Dolor sit amet consectetur adipiscing elit sed do eiusmod."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
        tone="primary"
      />

      {/* CHI SIAMO */}
      <section className="px-6 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <SectionHeading
              eyebrow="Lorem"
              title="Consectetur adipiscing elit"
              description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam."
            />

            <p className="mt-5 md:mt-6 max-w-3xl text-xs md:text-sm font-medium leading-7 text-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
              Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
              Duis sagittis ipsum. Praesent mauris.
            </p>

            <div className="mt-6">
              <ActionLink to="/chi-siamo" variant="secondary" className="text-sm md:text-base">
                Lorem ipsum
              </ActionLink>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-lg border border-primary/20 bg-background px-4 md:px-5 py-4 md:py-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Lorem ipsum
              </p>
              <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
              </p>
            </div>

            <div className="rounded-lg border border-secondary/30 bg-secondary/8 px-4 md:px-5 py-4 md:py-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                Dolor sit amet
              </p>
              <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-text">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTI */}
      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Lorem ipsum"
            title="Sed ut perspiciatis unde"
            description="Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
          />

          <ActionLink to="/eventi" variant="secondary" className="whitespace-nowrap flex-shrink-0">
            Lorem
          </ActionLink>
        </div>

        {isLoadingEvents ? (
          <div className="text-center py-8 text-text/60">
            <p>Lorem ipsum...</p>
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
            <p>Lorem ipsum dolor sit amet</p>
          </div>
        )}
      </section>

      {/* GALLERIA */}
      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Lorem"
            title="Lorem ipsum dolor sit"
            description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium."
          />

          <ActionLink to="/galleria" variant="secondary" className="whitespace-nowrap flex-shrink-0">
            Lorem
          </ActionLink>
        </div>

        {isLoadingPhotos ? (
          <div className="text-center py-8 text-text/60">
            <p>Lorem ipsum...</p>
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
            <p>Lorem ipsum dolor sit amet</p>
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
              <h2 className="text-lg font-bold text-text mb-1">
                Lorem ipsum dolor sit amet
              </h2>
              <p className="text-sm text-text/75">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA DONAZIONI */}
      <section className="mt-6 rounded-lg border border-primary/20 bg-background px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-14 text-center shadow-lg">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
          Lorem
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-text">
          Lorem ipsum dolor sit amet
        </h2>
        <p className="mx-auto mt-4 md:mt-5 max-w-2xl text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/75">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
        </p>

        <div className="mt-6 md:mt-7 flex flex-wrap justify-center gap-2 md:gap-3">
          <ActionLink to="/donazioni" variant="secondary">Lorem</ActionLink>
          <ActionLink to="/contatti" variant="secondary">
            Ipsum
          </ActionLink>
        </div>
      </section>

      {/* CONTATTI CTA */}
      <section className="mt-6 rounded-lg border border-primary/20 bg-primary px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-14 text-center text-white shadow-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
          LOREM
        </p>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
          Lorem ipsum dolor sit amet
        </h2>

        <p className="mx-auto mt-4 md:mt-5 max-w-2xl text-xs md:text-sm lg:text-base font-medium leading-6 md:leading-7 text-white/90">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
        </p>

        <div className="mt-6 md:mt-7 flex justify-center">
          <ActionLink to="/contatti" variant="dark">
            Lorem
          </ActionLink>
        </div>
      </section>
    </main>
  )
}

export default HomePage