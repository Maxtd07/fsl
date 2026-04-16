import { useEffect, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchPhotos } from '../lib/api.js'

/* ---------------------------
   Social Feed placeholder
----------------------------*/
function SocialMediaFeed() {
  return (
    <div className="overflow-hidden rounded-3xl border border-primary/15 bg-white p-6 shadow-sm">
      <div className="text-center">
        <p className="mb-4 text-sm font-semibold text-secondary">Galleria Social Media</p>
        <p className="text-xs text-text/60 mb-4">I contenuti della galleria social verranno visualizzati qui</p>
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition" aria-label="Visita il nostro profilo Instagram">
          Visita il nostro profilo
        </button>
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
        title="Scopri i momenti speciali della nostra associazione"
        description="Guarda le foto degli eventi e le attività della nostra comunità. Ogni immagine racconta una storia di crescita, condivisione e trasformazione."
        tone="accent"
        actions={
          <>
            <ActionLink to="/eventi">Scopri gli eventi</ActionLink>
            <ActionLink to="/contatti" variant="secondary">
              Contattaci
            </ActionLink>
          </>
        }
      />

      {/* UPLOADED PHOTOS */}
      {!isLoading && photos.length > 0 && (
        <section className="space-y-5 px-6">
          <SectionHeading
            eyebrow="Foto della comunità"
            title="Momenti significativi degli eventi"
            description="Una raccolta delle foto che documentano le attività, gli incontri e i momenti di crescita della nostra associazione."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative overflow-hidden rounded-lg border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-left"
                aria-label={`Visualizza foto: ${photo.titolo}`}
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
                  <h3 className="text-sm font-bold text-white">
                    {photo.titolo}
                  </h3>
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
              <h2 className="text-lg font-bold text-text mb-1">
                {selectedPhoto.titolo}
              </h2>
              <p className="text-sm text-text/75">
                {selectedPhoto.descrizione}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FACEBOOK */}
      <section className="border-t-2 border-primary/15 px-6 py-10 lg:py-12">
        <SectionHeading
          eyebrow="Seguici sui social"
          title="Resta aggiornato con i nostri canali"
          description="Seguici su Facebook e Instagram per ricevere gli ultimi aggiornamenti su eventi, attività e news della nostra associazione."
        />

        <div className="mt-6">
          <SocialMediaFeed />
        </div>
      </section>
    </main>
  )
}

export default GalleriaPage
