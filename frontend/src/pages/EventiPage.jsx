import ActionLink from '../components/ActionLink.jsx'
import MediaTile from '../components/MediaTile.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const eventItems = [
  {
    title: 'Lorem ipsum dolor sit amet consectetur.',
    meta: '12 Aprile',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  },
  {
    title: 'Sed ut perspiciatis unde omnis iste.',
    meta: '26 Aprile',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
  },
  {
    title: 'Quis autem vel eum iure reprehenderit.',
    meta: '10 Maggio',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
  },
]

const scheduleRows = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
]

function EventiPage() {
  return (
    <main>
      <PageHero
        eyebrow="Eventi"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit ut labore."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        tone="primary"
        actions={
          <>
            <ActionLink to="/contatti">Prenota ora</ActionLink>
            <ActionLink to="/galleria" variant="secondary">
              Vedi la galleria
            </ActionLink>
          </>
        }
      />

      <section className="border-t-2 border-primary/15 px-6 py-8 md:py-10 lg:py-12">
        <div className="mb-4 md:mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Prossimi eventi"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
          />
          <ActionLink to="/contatti" variant="secondary">
            Chiedi informazioni
          </ActionLink>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {eventItems.map((item, index) => (
            <MediaTile key={item.title} alt={`Evento ${index + 1}`} {...item} />
          ))}
        </div>
      </section>

      <section className="border-t-2 border-primary/15 bg-background px-6 py-8 md:py-10 lg:py-12">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <PlaceholderImage alt="Programma eventi" className="aspect-[4/3] w-full" />
          <div>
            <SectionHeading
              eyebrow="Programma"
              title="Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
            <div className="mt-6 space-y-5">
              {scheduleRows.map((text, index) => (
                <div
                  key={text}
                  className="rounded-[1.5rem] border-2 border-primary/20 bg-base px-4 md:px-5 py-4 md:py-5 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default EventiPage
