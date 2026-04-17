import { useEffect, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchFacebookPosts, fetchPhotos } from '../lib/api.js'

function formatFacebookDate(value) {
  if (!value) return ''

  try {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return ''
  }
}

function SocialMediaFeed({ posts, isLoading, error, onPostClick }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-[1.75rem] border border-primary/15 bg-white/80"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[1.75rem] border border-accent/20 bg-accent/5 p-6 text-sm text-text/75">
        Non siamo riusciti a caricare i post di Facebook in questo momento.
      </div>
    )
  }

  if (!posts.length) {
    return (
      <div className="rounded-[1.75rem] border border-primary/15 bg-white p-6 text-sm text-text/70 shadow-sm">
        Nessun post Facebook disponibile al momento.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <button
          key={post.id}
          onClick={() => onPostClick(post)}
          className="group overflow-hidden rounded-[1.75rem] border border-primary/15 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg text-left"
          aria-label={`Visualizza post Facebook: ${post.message ? post.message.slice(0, 80) : 'Nuovo aggiornamento'}`}
        >
          <div className="flex h-full flex-col">
            {post.fullPicture ? (
              <div className="relative overflow-hidden">
                <img
                  src={post.fullPicture}
                  alt={post.message ? `Post Facebook: ${post.message.slice(0, 80)}` : 'Post Facebook'}
                  className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center bg-primary/8 px-6 text-center text-sm font-semibold text-primary">
                Aggiornamento Facebook
              </div>
            )}

            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                Facebook
              </p>
              <h3 className="mt-3 text-lg font-bold leading-tight text-text">
                {post.message ? post.message.slice(0, 120) : 'Nuovo aggiornamento dalla nostra pagina Facebook'}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-text/75">
                {post.message && post.message.length > 120 ? `${post.message.slice(0, 120)}...` : 'Apri il post per vedere il contenuto completo.'}
              </p>
              <div className="mt-4 flex gap-3 text-xs text-text/60 border-t border-primary/10 pt-3">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {post.likesCount || 0}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {post.commentsCount || 0}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-text/55">
                  {formatFacebookDate(post.createdTime)}
                </span>
                <span className="inline-flex items-center justify-center rounded-full border border-primary/20 px-4 py-2 text-xs font-semibold text-primary bg-white group-hover:bg-primary/5 transition">
                  Visualizza
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

function GalleriaPage() {
  const [photos, setPhotos] = useState([])
  const [facebookPosts, setFacebookPosts] = useState([])
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true)
  const [isLoadingFacebook, setIsLoadingFacebook] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [selectedFacebookPost, setSelectedFacebookPost] = useState(null)
  const [facebookError, setFacebookError] = useState('')

  useEffect(() => {
    async function loadGalleryData() {
      const [photosResult, facebookResult] = await Promise.allSettled([
        fetchPhotos(),
        fetchFacebookPosts(),
      ])

      if (photosResult.status === 'fulfilled') {
        setPhotos(Array.isArray(photosResult.value) ? photosResult.value : [])
      } else {
        console.error('Errore caricamento foto:', photosResult.reason)
        setPhotos([])
      }

      if (facebookResult.status === 'fulfilled') {
        setFacebookPosts(Array.isArray(facebookResult.value) ? facebookResult.value : [])
        setFacebookError('')
      } else {
        console.error('Errore caricamento post Facebook:', facebookResult.reason)
        setFacebookPosts([])
        setFacebookError('Errore nel caricamento dei post Facebook.')
      }

      setIsLoadingPhotos(false)
      setIsLoadingFacebook(false)
    }

    loadGalleryData()
  }, [])

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="GALLERIA"
        title="Scopri i momenti speciali della nostra associazione"
        description="Guarda le foto degli eventi e le attivita della nostra comunita. Ogni immagine racconta una storia di crescita, condivisione e trasformazione."
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

      {!isLoadingPhotos && photos.length > 0 && (
        <section className="space-y-5 px-6">
          <SectionHeading
            eyebrow="Foto della comunita"
            title="Momenti significativi degli eventi"
            description="Una raccolta delle foto che documentano le attivita, gli incontri e i momenti di crescita della nostra associazione."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative overflow-hidden rounded-lg border border-primary/20 text-left shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
                aria-label={`Visualizza foto: ${photo.titolo}`}
              >
                {photo.immagine && (
                  <>
                    <img
                      src={photo.immagine}
                      alt={photo.titolo}
                      className="h-64 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
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

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
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
              <h2 className="mb-1 text-lg font-bold text-text">
                {selectedPhoto.titolo}
              </h2>
              <p className="text-sm text-text/75">
                {selectedPhoto.descrizione}
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="border-t-2 border-primary/15 px-6 py-10 lg:py-12">
        <SectionHeading
          eyebrow="Facebook"
          title="Gli ultimi post dalla nostra pagina"
          description="Una selezione degli aggiornamenti pubblicati su Facebook, integrata direttamente nella galleria."
        />

        <div className="mt-6">
          <SocialMediaFeed
            posts={facebookPosts}
            isLoading={isLoadingFacebook}
            error={facebookError}
            onPostClick={setSelectedFacebookPost}
          />
        </div>
      </section>

      {selectedFacebookPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedFacebookPost(null)}
        >
          <div
            className="relative w-full max-w-[37rem] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFacebookPost(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-lg font-bold text-white transition hover:bg-black/80"
              aria-label="Chiudi modal"
            >
              ✕
            </button>

            {selectedFacebookPost.fullPicture && (
              <img
                src={selectedFacebookPost.fullPicture}
                alt={selectedFacebookPost.message ? selectedFacebookPost.message.slice(0, 80) : 'Post Facebook'}
                className="h-auto max-h-[60vh] w-full object-contain"
              />
            )}

            <div className="space-y-4 bg-base p-6 md:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary mb-2">
                  Facebook
                </p>
                <h2 className="text-2xl font-bold text-text">
                  {selectedFacebookPost.message ? selectedFacebookPost.message.slice(0, 100) : 'Aggiornamento dalla nostra pagina'}
                </h2>
              </div>

              {selectedFacebookPost.message && (
                <p className="text-base leading-7 text-text/80">
                  {selectedFacebookPost.message}
                </p>
              )}

              <div className="flex gap-6 py-4 border-y border-primary/15 text-sm text-text/70">
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {selectedFacebookPost.likesCount || 0} mi piace
                </span>
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {selectedFacebookPost.commentsCount || 0} commenti
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-primary/15 pt-4">
                <span className="text-sm font-medium text-text/60">
                  {formatFacebookDate(selectedFacebookPost.createdTime)}
                </span>
                {selectedFacebookPost.permalinkUrl && (
                  <a
                    href={selectedFacebookPost.permalinkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(76,130,169,0.3)] transition hover:bg-primary/92"
                  >
                    Apri su Facebook
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default GalleriaPage
