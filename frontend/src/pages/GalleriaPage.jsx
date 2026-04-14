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