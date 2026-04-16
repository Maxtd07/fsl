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
   Facebook page embed
----------------------------*/
function FacebookFeed() {
  useEffect(() => {
    function parseFacebookPlugin() {
      if (window.FB?.XFBML?.parse) {
        window.FB.XFBML.parse()
      }
    }

    const script = document.querySelector(
      'script[src*="connect.facebook.net/it_IT/sdk.js"]',
    )

    parseFacebookPlugin()
    script?.addEventListener('load', parseFacebookPlugin)

    return () => {
      script?.removeEventListener('load', parseFacebookPlugin)
    }
  }, [])

  return (
    <div className="overflow-hidden rounded-3xl border border-primary/15 bg-white p-4 shadow-sm">
      <div
        className="fb-page"
        data-href="https://www.facebook.com/lacrisalideassociazionefamigliedisabili"
        data-tabs="timeline"
        data-small-header="true"
        data-adapt-container-width="true"
        data-hide-cover="true"
        data-show-facepile="true"
      >
        <blockquote
          cite="https://www.facebook.com/lacrisalideassociazionefamigliedisabili"
          className="fb-xfbml-parse-ignore"
        >
          <a href="https://www.facebook.com/lacrisalideassociazionefamigliedisabili">
            Associazione Disabili
          </a>
        </blockquote>
      </div>
    </div>
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
        eyebrow="GALLERIA"
        title="Scopri i momenti della nostra comunità"
        description="Esplora foto e ricordi delle attività, degli eventi e delle iniziative dell’associazione. Ogni immagine racconta esperienze, partecipazione e condivisione."
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
                className="group relative overflow-hidden rounded-lg border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-left"
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

      {/* FACEBOOK */}
      <section className="border-t-2 border-primary/15 px-6 py-10 lg:py-12">
        <SectionHeading
          eyebrow="Social"
          title="Seguici su Facebook"
          description="Aggiornamenti, eventi e attività in tempo reale."
        />

        <div className="mt-6">
          <FacebookFeed />
        </div>
      </section>
    </main>
  )
}

export default GalleriaPage
