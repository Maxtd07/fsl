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
  neutral: 'border-primary/20 bg-background',
  secondary: 'border-primary/20 bg-background',
  accent: 'border-primary/20 bg-background',
}

function PreviewBand({ eyebrow, title, description, to, action, tone }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border-2 px-6 py-8 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:px-8 md:py-10 border-primary/20 bg-background`}
    >
      <div aria-hidden="true" className="absolute inset-x-6 bottom-6 h-px bg-primary/12" />
      <div className="relative grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:items-start">
        <div>
          <p className="mb-2 md:mb-3 inline-flex rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
          <h3 className="max-w-3xl text-xl md:text-2xl lg:text-3xl font-bold tracking-[-0.03em] text-slate-900">
            {title}
          </h3>
          <p className="mt-3 md:mt-4 lg:mt-5 max-w-3xl text-xs md:text-sm lg:text-slate-800 font-medium leading-6 md:leading-7 text-slate-800">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 md:gap-4 lg:items-end">
          <PlaceholderImage alt={eyebrow} className="aspect-[16/10] w-full" />
          <ActionLink to={to} variant="surface" className="whitespace-nowrap">{action}</ActionLink>
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

      <section className="px-6 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <SectionHeading
              eyebrow="Chi siamo"
              title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            />
            <p className="mt-5 md:mt-6 max-w-3xl text-xs md:text-sm font-medium leading-7 text-slate-900">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="mt-6">
              <ActionLink to="/chi-siamo" variant="secondary" className="text-sm md:text-base">
                Leggi di piu
              </ActionLink>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[1.5rem] border-2 border-primary/20 bg-background px-4 md:px-5 py-4 md:py-5 shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                Curabitur
              </p>
              <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-slate-900">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="rounded-[1.5rem] border-2 border-secondary/30 bg-secondary/8 px-4 md:px-5 py-4 md:py-5 shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                Eget nisl
              </p>
              <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-slate-900">
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Prossimi eventi"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
          />
          <ActionLink to="/eventi" variant="secondary" className="whitespace-nowrap flex-shrink-0">
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

      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Galleria"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod."
          />
          <ActionLink to="/galleria" variant="secondary" className="whitespace-nowrap flex-shrink-0">
            Vedi tutto
          </ActionLink>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {galleryItems.map((title) => (
            <div key={title} className="flex flex-col gap-3">
              <PlaceholderImage alt={title} className="aspect-[4/3] w-full" />
              <p className="text-sm font-semibold text-primary">{title}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-6">
        {previewSections.map((section) => (
          <PreviewBand key={section.to} {...section} />
        ))}
      </div>

      <section className="mt-6 rounded-[2rem] border-2 border-primary/20 bg-background px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-14 text-center shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Sostieni
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] text-slate-900">
          Sostieni La Crisalide
        </h2>
        <p className="mx-auto mt-4 md:mt-5 max-w-2xl text-xs md:text-sm font-medium leading-6 md:leading-7 text-slate-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="mt-6 md:mt-7 flex flex-wrap justify-center gap-2 md:gap-3">
          <ActionLink to="/donazioni" variant="secondary">Dona ora</ActionLink>
          <ActionLink to="/contatti" variant="secondary">
            Richiedi informazioni
          </ActionLink>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] border-2 border-accent/20 bg-text px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-14 text-center text-white shadow-[0_16px_40px_rgba(0,0,0,0.15)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Resta in contatto
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em]">
          Lorem ipsum dolor sit amet
        </h2>
        <p className="mx-auto mt-4 md:mt-5 max-w-2xl text-xs md:text-sm lg:text-base font-medium leading-6 md:leading-7 text-white/85 md:text-white/80">
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <div className="mt-6 md:mt-7 flex justify-center">
          <ActionLink to="/contatti" variant="dark">
            Scrivici
          </ActionLink>
        </div>
      </section>
    </main>
  )
}

export default HomePage
