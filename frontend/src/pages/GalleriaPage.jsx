import { useEffect, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchPhotos } from '../lib/api.js'

const galleryBlocks = [
  'h-72 md:h-80',
  'h-60 md:h-72',
  'h-60 md:h-72',
  'h-72 md:h-80',
  'h-64 md:h-72',
  'h-64 md:h-72',
]

const galleryCards = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
]

/* ---------------------------
   Safe Instagram embed
----------------------------*/
function InstagramFeed() {
  useEffect(() => {
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
   Page
----------------------------*/
function GalleriaPage() {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    async function loadPhotos() {
      try {
        const data = await fetchPhotos()
        setPhotos(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Errore caricamento foto:', err)
        setPhotos([])
      } finally {
        setIsLoading(false)
      }
    }

    loadPhotos()
  }, [])

  return (
    <main className="space-y-8">
      {/* HERO */}
      <PageHero
        eyebrow="Galleria"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        tone="accent"
        actions={
          <>
            <ActionLink to="/eventi">Esplora eventi</ActionLink>
            <ActionLink to="/contatti" variant="secondary">
              Chiedi informazioni
            </ActionLink>
          </>
        }
      />

      {/* UPLOADED PHOTOS */}
      {!isLoading && photos.length > 0 && (
        <section className="space-y-5 px-6">
          <SectionHeading
            eyebrow="Foto Caricate"
            title="Ultimi scatti dalla nostra community"
            description="Momenti speciali catturati dai nostri partecipanti."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative overflow-hidden rounded-[1.4rem] border-2 border-primary/20 shadow-[0_6px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-105 text-left"
              >
                {photo.immagine && (
                  <>
                    <img
                      src={photo.immagine}
                      alt={photo.titolo}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
                  <h3 className="text-sm font-bold text-white">{photo.titolo}</h3>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full rounded-[2rem] overflow-hidden bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 text-white text-3xl font-bold hover:opacity-70 transition"
            >
              ✕
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

      {/* PREVIEW GRID */}
      <section className="space-y-5 px-6">
        <SectionHeading
          eyebrow="Anteprima"
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {galleryBlocks.map((height, index) => (
            <PlaceholderImage
              key={`${height}-${index}`}
              alt={`Galleria ${index + 1}`}
              className={`${height} shadow-[0_16px_34px_rgba(76,130,169,0.08)]`}
            />
          ))}
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Racconto"
            title="Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {galleryCards.map((text) => (
              <div
                key={text}
                className="rounded-[1.4rem] border-2 border-primary/20 bg-background p-4 md:p-5 shadow-[0_6px_14px_rgba(0,0,0,0.06)]"
              >
                <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <PlaceholderImage
          alt="Galleria racconto"
          className="h-72 md:h-80 lg:h-full lg:min-h-96"
        />
      </section>

      {/* INSTAGRAM */}
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

export default GalleriaPage