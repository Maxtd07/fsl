import { useState, useEffect } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

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

function GalleriaPage() {
  const [facebookPosts, setFacebookPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFacebookPosts()
  }, [])

  const fetchFacebookPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/facebook/posts')
      if (!response.ok) {
        throw new Error('Errore nel caricamento dei post da Facebook')
      }
      const data = await response.json()
      setFacebookPosts(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Errore:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Galleria"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt."
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

      <section className="space-y-5">
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

      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
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
                <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <PlaceholderImage alt="Galleria racconto" className="h-72 md:h-80 lg:h-full lg:min-h-96" />
      </section>

      {/* Facebook Posts Section */}
      <section className="space-y-5">
        <SectionHeading
          eyebrow="I nostri post"
          title="Ultimi post da Facebook"
          description="Scopri i nostri ultimi aggiornamenti sul nostro profilo Facebook."
        />

        {loading && (
          <div className="flex justify-center items-center py-12">
            <p className="text-text/70">Caricamento post in corso...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
            <p className="text-red-700">Errore nel caricamento dei post: {error}</p>
          </div>
        )}

        {!loading && !error && facebookPosts.length === 0 && (
          <div className="rounded-lg border-2 border-primary/20 bg-base p-6">
            <p className="text-center text-text/70">Nessun post disponibile al momento.</p>
          </div>
        )}

        {!loading && !error && facebookPosts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facebookPosts.map((post) => (
              <div
                key={post.id}
                className="overflow-hidden rounded-[1.4rem] border-2 border-primary/20 bg-base shadow-[0_6px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-shadow duration-300"
              >
                {/* Image */}
                {post.fullPicture ? (
                  <img
                    src={post.fullPicture}
                    alt={post.message || 'Facebook post'}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-primary/10 flex items-center justify-center">
                    <PlaceholderImage alt="Placeholder" className="w-full h-full" />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 md:p-5">
                  {/* Message */}
                  {post.message && (
                    <p className="text-sm md:text-base font-medium leading-6 md:leading-7 text-text/85 line-clamp-3 mb-3">
                      {post.message}
                    </p>
                  )}

                  {/* Date */}
                  {post.createdTime && (
                    <p className="text-xs text-text/60 mb-4">{formatDate(post.createdTime)}</p>
                  )}

                  {/* Link to Facebook */}
                  {post.permalinkUrl && (
                    <a
                      href={post.permalinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
                    >
                      Vedi su Facebook →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default GalleriaPage
