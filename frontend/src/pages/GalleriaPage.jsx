import { useEffect, useState, useRef, useCallback } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { fetchFacebookPosts, fetchPhotos } from '../lib/api.js'

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */

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

function getFacebookMedia(post) {
  if (Array.isArray(post?.media) && post.media.length > 0) {
    return post.media.filter((item) => item?.imageUrl || item?.url)
  }
  if (post?.fullPicture) {
    return [{ imageUrl: post.fullPicture, url: post.permalinkUrl }]
  }
  return []
}

function getPrimaryMedia(post) {
  return getFacebookMedia(post)[0] ?? null
}

function isFacebookMediaVideo(media) {
  const type = media?.type?.toLowerCase() ?? ''
  const url = media?.url?.toLowerCase() ?? ''
  return type.includes('video') || type.includes('reel') || url.includes('/reel/') || url.includes('/videos/')
}

function isFacebookVideoPost(post) {
  const permalinkUrl = post?.permalinkUrl?.toLowerCase() ?? ''
  const attachmentType = post?.attachmentType?.toLowerCase() ?? ''
  const hasVideoMedia = getFacebookMedia(post).some(isFacebookMediaVideo)
  return (
    permalinkUrl.includes('/reel/') ||
    permalinkUrl.includes('/videos/') ||
    attachmentType.includes('video') ||
    hasVideoMedia
  )
}

function isFacebookCarouselPost(post) {
  return getFacebookMedia(post).length > 1 || post?.attachmentType === 'album'
}

function getFacebookPostLabel(post) {
  if (isFacebookVideoPost(post)) return 'Reel'
  if (isFacebookCarouselPost(post)) return 'Carosello'
  return 'Post'
}

function getFacebookVideoEmbedUrl(post) {
  if (!post?.permalinkUrl) return null
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(post.permalinkUrl)}&show_text=false&width=560`
}

function getMediaAspectRatio(media, { clamp = true } = {}) {
  const width = Number(media?.width)
  const height = Number(media?.height)
  if (!width || !height) return isFacebookMediaVideo(media) ? '9 / 16' : '1 / 1'
  if (!clamp) return `${width} / ${height}`
  const ratio = width / height
  if (ratio < 4 / 5) return '4 / 5'
  if (ratio > 1.91) return '1.91 / 1'
  return `${width} / ${height}`
}

/* ─────────────────────────────────────────────────────────
   SMALL UI PIECES
───────────────────────────────────────────────────────── */

function Badge({ children, variant = 'dark' }) {
  const base = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider'
  const variants = {
    dark: 'bg-black/65 text-white backdrop-blur-sm',
    blue: 'bg-[#1877f2]/90 text-white backdrop-blur-sm',
    light: 'bg-white/85 text-[#050505] backdrop-blur-sm',
  }
  return <span className={`${base} ${variants[variant]}`}>{children}</span>
}

function PlayIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  )
}

function ImagesIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 15l-5-5L5 21h16v-6zM3 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm0 14V9l4 4 4-4 4 4V19H3z" />
    </svg>
  )
}

function CloseButton({ onClick, light = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
        light
          ? 'bg-[#f0f2f5] text-[#65676b] hover:bg-[#e4e6eb]'
          : 'bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm'
      }`}
      aria-label="Chiudi"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────
   CARD THUMBNAIL
───────────────────────────────────────────────────────── */

function FacebookCardThumbnail({ post }) {
  const mediaItems = getFacebookMedia(post)
  const primaryMedia = getPrimaryMedia(post)
  const isVideo = isFacebookVideoPost(post)
  const isCarousel = isFacebookCarouselPost(post)

  if (!primaryMedia?.imageUrl) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-[#e7f3ff]">
        <svg viewBox="0 0 24 24" fill="none" className="h-10 w-10 text-[#1877f2]/40" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden bg-[#f0f2f5]"
      style={{ aspectRatio: isVideo ? '4/5' : getMediaAspectRatio(primaryMedia) }}
    >
      <img
        src={primaryMedia.imageUrl}
        alt={post.message ? `Post Facebook: ${post.message.slice(0, 80)}` : 'Post Facebook'}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Badges */}
      <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
        {isVideo && (
          <Badge variant="dark">
            <PlayIcon className="h-3 w-3" />
            Reel
          </Badge>
        )}
        {isCarousel && !isVideo && (
          <Badge variant="dark">
            <ImagesIcon className="h-3 w-3" />
            {mediaItems.length} foto
          </Badge>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   POST CARD
───────────────────────────────────────────────────────── */

function FacebookPostCard({ post, onClick }) {
  const label = getFacebookPostLabel(post)
  const hasMessage = Boolean(post.message)
  const title = hasMessage ? post.message.slice(0, 110) : 'Nuovo aggiornamento dalla nostra pagina Facebook'
  const isLong = hasMessage && post.message.length > 110

  return (
    <button
      onClick={() => onClick(post)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#e4e6eb] bg-white text-left shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1877f2]/60"
      aria-label={`Visualizza post Facebook: ${title}`}
    >
      <FacebookCardThumbnail post={post} />

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[#e7f3ff] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1877f2]">
            {label}
          </span>
          <span className="text-[11px] text-[#65676b]">{formatFacebookDate(post.createdTime)}</span>
        </div>

        {/* Title / message */}
        <p className="flex-1 text-sm font-medium leading-snug text-[#050505] line-clamp-3">
          {title}
          {isLong && '…'}
        </p>

        {/* CTA */}
        <div className="mt-1 flex items-center justify-end">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1877f2] transition-colors group-hover:text-[#1464d2]">
            Visualizza
          </span>
        </div>
      </div>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────
   MODAL MEDIA — video
───────────────────────────────────────────────────────── */

function FacebookVideoEmbed({ post }) {
  return (
    <div className="flex items-center justify-center bg-black p-0">
      <div className="w-full" style={{ aspectRatio: '9/16', maxHeight: '70vh' }}>
        <iframe
          src={getFacebookVideoEmbedUrl(post)}
          title={post.message ? `Reel Facebook: ${post.message.slice(0, 80)}` : 'Reel Facebook'}
          className="h-full w-full"
          style={{ border: 0, display: 'block' }}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MODAL MEDIA — carousel
───────────────────────────────────────────────────────── */

function FacebookCarousel({ post }) {
  const mediaItems = getFacebookMedia(post)
  const [current, setCurrent] = useState(0)
  const trackRef = useRef(null)
  const startX = useRef(null)

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCurrent((c) => Math.min(mediaItems.length - 1, c + 1)), [mediaItems.length])

  // keyboard nav
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  // touch swipe
  function onTouchStart(e) { startX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (startX.current === null) return
    const delta = startX.current - e.changedTouches[0].clientX
    if (delta > 40) next()
    if (delta < -40) prev()
    startX.current = null
  }

  const media = mediaItems[current]

  return (
    <div
      className="relative select-none overflow-hidden bg-[#18191a]"
      style={{ maxHeight: '65vh' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      ref={trackRef}
    >
      {/* Image */}
      <div className="flex items-center justify-center" style={{ minHeight: 260 }}>
        <img
          key={current}
          src={media?.imageUrl}
          alt={media?.title || `Foto ${current + 1} di ${mediaItems.length}`}
          className="h-auto w-full object-contain"
          style={{ maxHeight: '60vh' }}
          loading="lazy"
        />
      </div>

      {/* Prev / Next buttons */}
      {current > 0 && (
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/80"
          aria-label="Foto precedente"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      {current < mediaItems.length - 1 && (
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/80"
          aria-label="Foto successiva"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {mediaItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-200 ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
            aria-label={`Vai alla foto ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute left-2.5 top-2.5">
        <Badge variant="dark">{current + 1} / {mediaItems.length}</Badge>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MODAL MEDIA — single image
───────────────────────────────────────────────────────── */

function FacebookSingleImage({ post }) {
  const primary = getPrimaryMedia(post)
  if (!primary?.imageUrl) return null
  return (
    <div className="flex items-center justify-center bg-[#18191a]" style={{ maxHeight: '65vh' }}>
      <img
        src={primary.imageUrl}
        alt={post.message ? post.message.slice(0, 80) : 'Post Facebook'}
        className="h-auto w-full object-contain"
        style={{ maxHeight: '60vh' }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MODAL — full post detail
───────────────────────────────────────────────────────── */

function FacebookPostModal({ post, onClose }) {
  const isVideo = isFacebookVideoPost(post)
  const isCarousel = isFacebookCarouselPost(post)
  const label = getFacebookPostLabel(post)

  // close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  const maxW = isVideo ? 'max-w-sm sm:max-w-md' : 'max-w-lg sm:max-w-2xl'

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className={`relative flex w-full ${maxW} max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Post Facebook: ${post.message?.slice(0, 60) || 'Visualizza post'}`}
      >
        {/* Close */}
        <div className="absolute right-3 top-3 z-20">
          <CloseButton onClick={onClose} />
        </div>

        {/* Media area */}
        <div className="shrink-0">
          {isVideo && <FacebookVideoEmbed post={post} />}
          {!isVideo && isCarousel && <FacebookCarousel post={post} />}
          {!isVideo && !isCarousel && <FacebookSingleImage post={post} />}
        </div>

        {/* Text body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="p-4 sm:p-5 space-y-3">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue">{label}</Badge>
              <span className="text-xs" style={{ color: '#65676b' }}>
                {formatFacebookDate(post.createdTime)}
              </span>
            </div>

            {/* Message */}
            {post.message && (
              <p
                className="text-sm leading-relaxed whitespace-pre-line sm:text-base"
                style={{ color: '#050505', WebkitTextFillColor: '#050505' }}
              >
                {post.message}
              </p>
            )}

            {/* Reel notice */}
            {isVideo && (
              <p className="rounded-xl bg-[#f0f2f5] px-3.5 py-2.5 text-xs" style={{ color: '#65676b' }}>
                Se il reel non si avvia, aprilo direttamente su Facebook dal pulsante in basso.
              </p>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        {post.permalinkUrl && (
          <div className="shrink-0 border-t border-[#e4e6eb] bg-white px-4 py-3 sm:px-5">
            <a
              href={post.permalinkUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1464d2] active:bg-[#1158bd] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1877f2]/60"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              Apri su Facebook
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   FEED (grid)
───────────────────────────────────────────────────────── */

function SocialMediaFeed({ posts, isLoading, error, onPostClick }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-[#e4e6eb] bg-white">
            <div className="aspect-[4/3] animate-pulse bg-[#f0f2f5]" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded-full bg-[#f0f2f5]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#f0f2f5]" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-[#f0f2f5]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#e4e6eb] bg-[#f8f9fa] p-8 text-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-[#65676b]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-sm text-[#65676b]">Non è stato possibile caricare i post di Facebook.<br />Riprova più tardi.</p>
      </div>
    )
  }

  if (!posts.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#e4e6eb] bg-[#f8f9fa] p-8 text-center">
        <p className="text-sm text-[#65676b]">Nessun post Facebook disponibile al momento.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <FacebookPostCard key={post.id} post={post} onClick={onPostClick} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   PHOTO MODAL
───────────────────────────────────────────────────────── */

function PhotoModal({ photo, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute right-3 top-3 z-10">
          <CloseButton onClick={onClose} />
        </div>
        {photo.immagine && (
          <img
            src={photo.immagine}
            alt={photo.titolo}
            className="h-auto max-h-[65vh] w-full object-contain bg-[#18191a]"
          />
        )}
        <div className="p-4 sm:p-5">
          <h2 className="text-base font-bold text-[#050505] sm:text-lg line-clamp-2">{photo.titolo}</h2>
          {photo.descrizione && (
            <p className="mt-1 text-sm text-[#65676b] line-clamp-4">{photo.descrizione}</p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */

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
        setFacebookError(facebookResult.reason?.message || 'Errore caricamento post Facebook')
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
        title="Scopri i momenti speciali di ASD Soccer Dream Fermana"
        description="Guarda foto e aggiornamenti che raccontano allenamenti, eventi, iniziative inclusive e la vita della squadra dentro e fuori dal campo."
        tone="accent"
        actions={
          <>
            <ActionLink to="/eventi">Scopri gli eventi</ActionLink>
            <ActionLink to="/contatti" variant="secondary">Contattaci</ActionLink>
          </>
        }
      />

      {/* ── Photo grid ── */}
      {!isLoadingPhotos && photos.length > 0 && (
        <section className="space-y-5 px-4 sm:px-6">
          <SectionHeading
            eyebrow="Foto della squadra"
            title="Momenti significativi degli eventi"
            description="Una raccolta di immagini che documentano attività, partite, incontri e momenti condivisi da ASD Soccer Dream Fermana."
          />
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative overflow-hidden rounded-xl border border-primary/20 shadow-sm transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label={`Visualizza foto: ${photo.titolo}`}
              >
                {photo.immagine && (
                  <img
                    src={photo.immagine}
                    alt={photo.titolo}
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-52 md:h-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-semibold text-white line-clamp-2 drop-shadow sm:text-sm">
                    {photo.titolo}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Facebook feed ── */}
      <section className="border-t-2 border-primary/15 px-4 py-8 sm:px-6 lg:py-12">
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

      {/* ── Modals ── */}
      {selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
      {selectedFacebookPost && (
        <FacebookPostModal
          post={selectedFacebookPost}
          onClose={() => setSelectedFacebookPost(null)}
        />
      )}
    </main>
  )
}

export default GalleriaPage