import ActionLink from '../components/ActionLink.jsx'
import MediaTile from '../components/MediaTile.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const values = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
]

const teamItems = [
  {
    title: 'Lorem ipsum dolor sit amet',
    meta: 'Profilo 01',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  },
  {
    title: 'Sed ut perspiciatis unde',
    meta: 'Profilo 02',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
  },
  {
    title: 'Quis autem vel eum iure',
    meta: 'Profilo 03',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
  },
]

function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="Chi siamo"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit ut labore."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur."
        tone="primary"
        actions={
          <>
            <ActionLink to="/contatti">Contattaci</ActionLink>
            <ActionLink to="/donazioni" variant="secondary">
              Sostieni il progetto
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-10 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div>
          <SectionHeading
            eyebrow="La nostra storia"
            title="Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
          />
          <p className="mt-5 max-w-3xl text-sm leading-7 text-text/74">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
        </div>

        <div className="space-y-5">
          {values.map((text, index) => (
            <div
              key={text}
              className="rounded-[1.5rem] border border-primary/12 bg-base px-5 py-5 shadow-[0_14px_30px_rgba(76,130,169,0.05)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Valore {index + 1}
              </p>
              <p className="mt-3 text-sm leading-7 text-text/78">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/12 bg-background px-6 py-10 sm:px-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <PlaceholderImage alt="Chi siamo" className="aspect-[4/3] w-full" />
          <div>
            <SectionHeading
              eyebrow="Missione"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-secondary/20 bg-secondary/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                  Lorem
                </p>
                <p className="mt-3 text-sm leading-7 text-text/78">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-accent/30 bg-accent/18 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text">
                  Ipsum
                </p>
                <p className="mt-3 text-sm leading-7 text-text/78">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-primary/12 px-6 py-10 sm:px-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Persone"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt."
          />
          <ActionLink to="/contatti" variant="secondary">
            Parla con noi
          </ActionLink>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {teamItems.map((item, index) => (
            <MediaTile key={item.title} alt={`Persona ${index + 1}`} {...item} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default AboutPage
