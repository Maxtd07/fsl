import { useEffect } from 'react'
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
  useEffect(() => {
    // Carica lo script Elfsight
    const script = document.createElement('script')
    script.src = 'https://elfsightcdn.com/platform.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup opzionale
    }
  }, [])

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

      {/* Elfsight Instagram Feed Section */}
      <section className="space-y-5">
        <SectionHeading
          eyebrow="I nostri post"
          title="Ultimi post da Instagram"
          description="Scopri i nostri ultimi aggiornamenti sul nostro profilo Instagram."
        />

        <div className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
          <div className="elfsight-app-614ff7dd-13fe-40be-841d-0b9e0c186e97" data-elfsight-app-lazy></div>
        </div>
      </section>
    </main>
  )
}

export default GalleriaPage
