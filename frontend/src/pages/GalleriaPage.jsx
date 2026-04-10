import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const galleryBlocks = [
  'h-72 sm:h-80',
  'h-60 sm:h-72',
  'h-60 sm:h-72',
  'h-72 sm:h-80',
  'h-64 sm:h-72',
  'h-64 sm:h-72',
]

const galleryCards = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
]

function GalleriaPage() {
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

      <section className="grid gap-6 rounded-[2rem] border border-primary/12 bg-base p-6 shadow-[0_18px_40px_rgba(76,130,169,0.06)] sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Racconto"
            title="Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {galleryCards.map((text) => (
              <div
                key={text}
                className="rounded-[1.4rem] border border-primary/10 bg-background p-5"
              >
                <p className="text-sm leading-7 text-text/80">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <PlaceholderImage alt="Galleria racconto" className="h-72 sm:h-80 lg:h-full lg:min-h-96" />
      </section>
    </main>
  )
}

export default GalleriaPage
