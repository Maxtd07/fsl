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

const galleryItems = [
  'Galleria 1',
  'Galleria 2',
  'Galleria 3',
  'Galleria 4',
]

const previewSections = [
  {
    eyebrow: 'Chi siamo',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    to: '/chi-siamo',
    action: 'Leggi di piu',
    tone: 'neutral',
  },
  {
    eyebrow: 'Donazioni',
    title: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nemo enim ipsam voluptatem.',
    to: '/donazioni',
    action: 'Scopri donazioni',
    tone: 'secondary',
  },
  {
    eyebrow: 'Contatti',
    title: 'Ut enim ad minima veniam quis nostrum exercitationem ullam.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis autem vel eum iure reprehenderit.',
    to: '/contatti',
    action: 'Vai ai contatti',
    tone: 'accent',
  },
]

const previewTones = {
  neutral: 'border-gray-300 bg-background',
  secondary: 'border-gray-300 bg-gray-100',
  accent: 'border-gray-300 bg-gray-100',
}

function PreviewBand({ eyebrow, title, description, to, action, tone }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border-2 px-6 py-8 shadow-[0_12px_28px_rgba(0,0,0,0.08)] sm:px-8 sm:py-10 ${previewTones[tone] ?? previewTones.neutral}`}
    >
      <div aria-hidden="true" className="absolute inset-x-6 bottom-6 h-px bg-gray-200" />
      <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:items-start">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-text">
            {eyebrow}
          </p>
          <h3 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-text">
            {title}
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-text/74 sm:text-base">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <PlaceholderImage alt={eyebrow} className="aspect-[16/10] w-full" />
          <ActionLink to={to}>{action}</ActionLink>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <main>
      <PageHero
        eyebrow="Benvenuti"
        title="Benvenuti in La Crisalide"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc fermentum tellus in consequat, proprio congue urna tristique eleifend et dui."
        tone="primary"
      />

      <section className="px-6 py-10 sm:px-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <SectionHeading
              eyebrow="Chi siamo"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            />
            <p className="mt-5 max-w-3xl text-sm leading-7 text-text/74">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="mt-6">
              <ActionLink to="/chi-siamo" variant="secondary">
                Leggi di piu
              </ActionLink>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[1.5rem] border-2 border-gray-300 bg-gray-100 px-5 py-5 shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text">
                Curabitur
              </p>
              <p className="mt-3 text-sm leading-7 text-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="rounded-[1.5rem] border-2 border-gray-300 bg-gray-100 px-5 py-5 shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text">
                Eget nisl
              </p>
              <p className="mt-3 text-sm leading-7 text-text">
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-gray-200 px-6 py-10 sm:px-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Prossimi eventi"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
          />
          <ActionLink to="/eventi" variant="secondary">
            Vedi tutti
          </ActionLink>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {eventItems.map((item, index) => (
            <MediaTile
              key={item.title}
              alt={`Evento ${index + 1}`}
              {...item}
            />
          ))}
        </div>
      </section>

      <section className="border-t-2 border-gray-200 bg-background px-6 py-10 sm:px-8 sm:py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Galleria"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod."
          />
          <ActionLink to="/galleria" variant="secondary">
            Vedi tutto
          </ActionLink>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {galleryItems.map((title) => (
            <div key={title} className="flex flex-col gap-3">
              <PlaceholderImage alt={title} className="aspect-[4/3] w-full" />
              <p className="text-sm font-medium text-text">{title}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-6">
        {previewSections.map((section) => (
          <PreviewBand key={section.to} {...section} />
        ))}
      </div>

      <section className="mt-6 rounded-[2rem] border-2 border-gray-300 bg-gray-100 px-6 py-14 text-center shadow-[0_12px_28px_rgba(0,0,0,0.08)] sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Sostieni
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] text-text sm:text-4xl">
          Sostieni La Crisalide
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text/74 sm:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ActionLink to="/donazioni">Dona ora</ActionLink>
          <ActionLink to="/contatti" variant="secondary">
            Richiedi informazioni
          </ActionLink>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border-2 border-gray-800 bg-text px-6 py-14 text-center text-white shadow-[0_16px_40px_rgba(0,0,0,0.15)] sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Resta in contatto
        </p>
        <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Lorem ipsum dolor sit amet
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <div className="mt-7 flex justify-center">
          <ActionLink to="/contatti" variant="light">
            Scrivici
          </ActionLink>
        </div>
      </section>
    </main>
  )
}

export default HomePage
